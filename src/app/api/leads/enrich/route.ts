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
        const { leadId, domain, linkedin_url } = body;

        if (!leadId && !domain && !linkedin_url) {
            return NextResponse.json({ error: 'Missing leadId, domain, or linkedin_url' }, { status: 400 });
        }

        let targetDomain = domain;
        let targetUrl = linkedin_url;
        let currentEnrichment = {};

        // If leadId provided, fetch lead details first
        if (leadId) {
            const { data: lead, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', leadId)
                .eq('user_id', user.id)
                .single();

            if (error || !lead) {
                return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
            }

            targetUrl = lead.linkedin_url;
            currentEnrichment = lead.enrichment_data || {};

            // Extract domain from email if not provided
            if (!targetDomain && lead.email) {
                targetDomain = lead.email.split('@')[1];
            }
        }

        // Execute script via Bridge
        const response = await AIBridge.runPythonScript('enrich_lead.py', {
            domain: targetDomain,
            linkedin_url: targetUrl
        });

        if (!response.success) {
            return NextResponse.json({
                error: response.error,
                details: response.details
            }, { status: 500 });
        }

        const enrichedData = response.data;

        // Update Lead if leadId exists
        if (leadId) {
            const mergedData = {
                ...currentEnrichment,
                ...enrichedData,
                last_enriched: new Date().toISOString()
            };

            const { error: updateError } = await supabase
                .from('leads')
                .update({ enrichment_data: mergedData })
                .eq('id', leadId);

            if (updateError) {
                console.error('Failed to update lead:', updateError);
                return NextResponse.json({ error: 'Failed to update lead database' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, data: enrichedData });

    } catch (error: any) {
        console.error('Enrichment API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}
