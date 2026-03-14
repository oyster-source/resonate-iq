import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIBridge } from '@/lib/ai/python-bridge';

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

        // Execute script via AIBridge
        const response = await AIBridge.runPythonScript('generate_email.py', {
            lead_json: JSON.stringify({
                ...lead,
                ...lead.enrichment_data
            })
        });

        if (!response.success) {
            console.error('Email Generation Error:', response.error, response.details);
            return NextResponse.json({
                error: response.error || 'Generation failed',
                details: response.details
            }, { status: 500 });
        }

        const generatedEmail = response.data;

        // Update Lead with Draft
        const mergedData = {
            ...(lead.enrichment_data || {}),
            email_draft: generatedEmail,
            last_drafted: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update({ enrichment_data: mergedData })
            .eq('id', leadId);

        if (updateError) {
            console.error('Failed to update lead:', updateError);
            return NextResponse.json({ error: 'Failed to update lead database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: generatedEmail });

    } catch (error: any) {
        console.error('Email Generation API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
