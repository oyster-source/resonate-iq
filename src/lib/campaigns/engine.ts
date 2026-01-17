
// Define types
type Lead = {
    id: string;
    email: string;
    enrichment_data: Record<string, any>;
};

type CampaignLead = {
    id: string;
    status: string;
    current_step_id: string | null;
    next_step_at: string;
    leads: Lead | Lead[]; // Supabase join can return object or array depending on inferred relationship
};

import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/client";
import { addDays, addHours, isBefore } from "date-fns";

export async function processCampaigns() {
    const supabase = await createClient();

    // 1. Fetch active campaigns
    const { data: campaigns } = await supabase
        .from("campaigns")
        .select("id, name, user_id, from_email") // Assuming from_email exists or we defaults
        .eq("status", "active");

    if (!campaigns || campaigns.length === 0) return { message: "No active campaigns" };

    const results = [];

    for (const campaign of campaigns) {
        // 2. Fetch leads in this campaign that are due for a step
        const { data: leadsData } = await supabase
            .from("campaign_leads")
            .select(`
                id, lead_id, status, current_step_id, next_step_at,
                leads ( id, email, enrichment_data )
            `)
            .eq("campaign_id", campaign.id)
            .eq("status", "active")
            .lte("next_step_at", new Date().toISOString())
            .limit(50); // Batch size

        const leads = leadsData as unknown as CampaignLead[];

        if (!leads || leads.length === 0) continue;

        // 3. Fetch Campaign Steps
        const { data: steps } = await supabase
            .from("campaign_steps")
            .select(`
                id, type, order_index, delay_days,
                email_variants ( id, subject, body, name )
            `)
            .eq("campaign_id", campaign.id)
            .order("order_index", { ascending: true });

        if (!steps || steps.length === 0) continue;

        for (const leadItem of leads) {
            const lead = Array.isArray(leadItem.leads) ? leadItem.leads[0] : leadItem.leads;

            if (!lead) continue;

            // Determine which step to send
            // If current_step_id is null, it means start at the first step
            let nextStepIndex = 0;
            if (leadItem.current_step_id) {
                const currentStepIndex = steps.findIndex(s => s.id === leadItem.current_step_id);
                nextStepIndex = currentStepIndex + 1;
            }

            // If we've passed the last step, mark as completed
            if (nextStepIndex >= steps.length) {
                await supabase.from("campaign_leads").update({ status: "completed" }).eq("id", leadItem.id);
                continue;
            }

            const stepToSend = steps[nextStepIndex];

            // If it's a DELAY step, we just update the next_step_at and current_step_id
            if (stepToSend.type === "delay") {
                const delayDays = stepToSend.delay_days || 1;
                const nextRunAt = addDays(new Date(), delayDays);

                await supabase.from("campaign_leads").update({
                    current_step_id: stepToSend.id,
                    next_step_at: nextRunAt.toISOString()
                }).eq("id", leadItem.id);

                results.push({ lead: lead.email, action: "processed_delay" });
                continue;
            }

            // If it's an EMAIL step
            if (stepToSend.type === "email") {
                // Select Variant (Random for now)
                const variants = stepToSend.email_variants;
                if (!variants || variants.length === 0) {
                    console.error(`No variants for step ${stepToSend.id}`);
                    continue;
                }
                const variant = variants[Math.floor(Math.random() * variants.length)];

                // Simple template replacement
                let subject = variant.subject;
                let body = variant.body;
                const enrichment = (lead.enrichment_data || {}) as Record<string, unknown>;

                // Replace variables
                const variables: Record<string, string> = {
                    "{{firstName}}": String(enrichment.first_name || "there"),
                    "{{lastName}}": String(enrichment.last_name || ""),
                    "{{company}}": String(enrichment.company || "your company"),
                    "{{title}}": String(enrichment.title || "Founders"),
                    "{{email}}": lead.email
                };

                for (const [key, value] of Object.entries(variables)) {
                    subject = subject.replace(new RegExp(key, 'g'), value);
                    body = body.replace(new RegExp(key, 'g'), value);
                }

                // Send Email via Resend
                // TODO: Get user's sending domain/email dynamically. For now using a default or env var.
                const fromEmail = process.env.DEFAULT_FROM_EMAIL || "onboarding@resend.dev";

                try {
                    const { data: emailData, error: emailError } = await resend.emails.send({
                        from: fromEmail,
                        to: lead.email,
                        subject: subject,
                        html: body.replace(/\n/g, "<br/>"), // Simple text to HTML
                        // text: body // Optional: send plain text version
                    });

                    // Log failure?
                    if (emailError) {
                        console.error("Resend Error", emailError);
                        await supabase.from("campaign_leads").update({
                            next_step_at: addHours(new Date(), 1).toISOString() // Retry in 1 hour
                        }).eq("id", leadItem.id);
                        continue;
                    }

                    // Log success and advance state
                    await supabase.from("email_logs").insert({
                        campaign_id: campaign.id,
                        lead_id: lead.id,
                        step_id: stepToSend.id,
                        variant_id: variant.id,
                        message_id: emailData?.id,
                        status: "sent"
                    });

                    // Calculate next step delay (if next step is a delay, we could process it now, 
                    // but cleaner to just mark this step done and let next run handle the delay step?)
                    // Actually, if the NEXT step is delay, we usually wait AFTER this email. 
                    // But in our model, "Delay" is a step type.
                    // So we just set current_step_id = this step, and next_step_at = NOW (so we can process the delay step immediately next run)
                    // OR if we want to wait "1 day" between emails by default?
                    // The "Delay" step handles the wait. So we set next_step_at = NOW.

                    await supabase.from("campaign_leads").update({
                        current_step_id: stepToSend.id,
                        next_step_at: new Date().toISOString()
                    }).eq("id", leadItem.id);

                    results.push({ lead: lead.email, action: "sent_email", subject });

                } catch (err) {
                    console.error("Sending Exception", err);
                }
            }
        }
    }

    return { processed: results.length, details: results };
}
