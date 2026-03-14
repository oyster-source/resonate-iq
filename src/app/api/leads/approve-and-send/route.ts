import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { leadId } = body;

        if (!leadId) {
            return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
        }

        // Fetch Lead Data
        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .eq('user_id', user.id)
            .single();

        if (error || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const draft = lead.enrichment_data?.email_draft;

        if (!draft || !draft.subject || !draft.body) {
            return NextResponse.json({ error: 'No valid draft found to send' }, { status: 400 });
        }

        // Send Email
        const fromEmail = process.env.DEFAULT_FROM_EMAIL || 'onboarding@resend.dev';

        try {
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: fromEmail,
                to: lead.email,
                subject: draft.subject,
                html: draft.body.replace(/\n/g, '<br/>'),
            });

            if (emailError) {
                console.error('Resend Error:', emailError);
                return NextResponse.json({ error: 'Failed to send email via Resend', details: emailError }, { status: 500 });
            }

            // Log successful manual send
            await supabase.from('email_logs').insert({
                lead_id: lead.id,
                status: 'sent',
                message_id: emailData?.id,
                subject: draft.subject
            });

            return NextResponse.json({ success: true, messageId: emailData?.id });

        } catch (e: any) {
            console.error('Send Exception:', e);
            return NextResponse.json({ error: 'Exception while sending email', details: e.message }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Approve & Send API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
