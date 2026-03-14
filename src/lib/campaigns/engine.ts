
// Define types
type Lead = {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    enrichment_data: Record<string, any>;
};

type CampaignLead = {
    id: string;
    status: string;
    current_step_id: string | null;
    next_step_at: string;
    leads: Lead | Lead[];
};

import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/client";
import { AIBridge } from "@/lib/ai/python-bridge";
import { addDays, addHours } from "date-fns";

export async function processCampaigns() {
    const supabase = await createClient();

    // 1. Fetch active campaigns
    const { data: campaigns } = await supabase
        .from("campaigns")
        .select("id, name, user_id, from_email")
        .eq("status", "active");

    if (!campaigns || campaigns.length === 0) return { message: "No active campaigns" };

    const results = [];

    for (const campaign of campaigns) {
        // 2. Fetch leads in this campaign that are due for a step
        const { data: leadsData } = await supabase
            .from("campaign_leads")
            .select(`
                id, lead_id, status, current_step_id, next_step_at,
                leads ( id, email, first_name, last_name, company, enrichment_data )
            `)
            .eq("campaign_id", campaign.id)
            .eq("status", "active")
            .lte("next_step_at", new Date().toISOString())
            .limit(50);

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

            // Optional: Auto-score if not scored yet
            // This is a powerful addition to the engine
            const { data: leadFull } = await supabase
                .from('leads')
                .select('score')
                .eq('id', lead.id)
                .single();

            if (leadFull && leadFull.score === null) {
                console.log(`[Engine] Auto-scoring lead ${lead.id}`);
                await AIBridge.runPythonScript('score_lead.py', {
                    lead_json: JSON.stringify({ ...lead, enrichment_data: lead.enrichment_data })
                }).then(async (res) => {
                    if (res.success) {
                        await supabase.from('leads').update({
                            score: res.data.score,
                            score_reason: res.data.reason
                        }).eq('id', lead.id);
                    }
                });
            }

            // 4. Determine which step to send
            let nextStepIndex = 0;
            if (leadItem.current_step_id) {
                const currentStepIndex = steps.findIndex(s => s.id === leadItem.current_step_id);
                nextStepIndex = currentStepIndex + 1;
            }

            // Unsubscribe check
            const { data: leadStatus } = await supabase
                .from('leads')
                .select('is_unsubscribed')
                .eq('id', lead.id)
                .single();

            if (leadStatus?.is_unsubscribed) {
                console.log(`[Engine] Skipping unsubscribed lead ${lead.email}`);
                await supabase.from("campaign_leads").update({ status: "unsubscribed" }).eq("id", leadItem.id);
                continue;
            }

            if (nextStepIndex >= steps.length) {
                await supabase.from("campaign_leads").update({ status: "completed" }).eq("id", leadItem.id);
                continue;
            }

            const stepToSend = steps[nextStepIndex];

            // Calculate next step timing AFTER this one
            const peekNextStep = steps[nextStepIndex + 1];
            let nextRunAt = new Date();
            if (peekNextStep) {
                const delay = peekNextStep.delay_days || 1;
                nextRunAt = addDays(new Date(), delay);
            }

            if (stepToSend.type === "delay") {
                // Already handled in logic above usually, but let's be explicit
                await supabase.from("campaign_leads").update({
                    current_step_id: stepToSend.id,
                    next_step_at: addDays(new Date(), stepToSend.delay_days || 1).toISOString()
                }).eq("id", leadItem.id);

                results.push({ lead: lead.email, action: "processed_delay" });
                continue;
            }

            if (stepToSend.type === "email") {
                const variants = stepToSend.email_variants;
                if (!variants || variants.length === 0) {
                    console.error(`No variants for step ${stepToSend.id}`);
                    continue;
                }
                const variant = variants[Math.floor(Math.random() * variants.length)];

                let subject = variant.subject;
                let body = variant.body;

                // AI Copywriting Integration
                const aiResponse = await AIBridge.runPythonScript('generate_email.py', {
                    lead_json: JSON.stringify({
                        ...lead,
                        original_subject: subject,
                        original_body: body
                    })
                });

                if (aiResponse.success && aiResponse.data) {
                    subject = aiResponse.data.subject || subject;
                    body = aiResponse.data.body || body;
                    console.log(`[Engine] AI copywriting successful for ${lead.email}`);
                } else {
                    console.warn(`[Engine] AI copywriting failed, falling back to template for ${lead.email}`);
                    const enrichment = (lead.enrichment_data || {}) as Record<string, unknown>;
                    const variables: Record<string, string> = {
                        "{{firstName}}": String(lead.first_name || enrichment.first_name || "there"),
                        "{{lastName}}": String(lead.last_name || enrichment.last_name || ""),
                        "{{company}}": String(lead.company || enrichment.company || "your company"),
                        "{{title}}": String(enrichment.title || "Founders"),
                        "{{email}}": lead.email
                    };

                    for (const [key, value] of Object.entries(variables)) {
                        subject = subject.replace(new RegExp(key, 'g'), value);
                        body = body.replace(new RegExp(key, 'g'), value);
                    }
                }

                // Add Unsubscribe Link
                const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/outreach/unsubscribe?id=${lead.id}`;
                body += `<br/><br/><p style="font-size: 12px; color: #888;">If you'd rather not hear from me, <a href="${unsubscribeUrl}">unsubscribe here</a>.</p>`;

                const fromEmail = campaign.from_email || process.env.DEFAULT_FROM_EMAIL || "onboarding@resend.dev";

                try {
                    const { data: emailData, error: emailError } = await resend.emails.send({
                        from: fromEmail,
                        to: lead.email,
                        subject: subject,
                        html: body.replace(/\n/g, "<br/>"),
                    });

                    if (emailError) {
                        console.error("Resend Error", emailError);
                        // Back off for an hour on error
                        await supabase.from("campaign_leads").update({
                            next_step_at: addHours(new Date(), 1).toISOString()
                        }).eq("id", leadItem.id);
                        continue;
                    }

                    // Log the email
                    await supabase.from("email_logs").insert({
                        campaign_id: campaign.id,
                        lead_id: lead.id,
                        step_id: stepToSend.id,
                        variant_id: variant.id,
                        message_id: emailData?.id,
                        status: "sent",
                        subject: subject
                    });

                    // Update Lead Progress - next_step_at is calculated from peek
                    await supabase.from("campaign_leads").update({
                        current_step_id: stepToSend.id,
                        next_step_at: nextRunAt.toISOString(),
                        status: peekNextStep ? "active" : "completed"
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
