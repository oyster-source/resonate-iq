
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

        // Fetch lead details
        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .eq('user_id', user.id)
            .single();

        if (error || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Execute Scoring Agent
        const response = await AIBridge.runPythonScript('score_lead.py', {
            lead_json: JSON.stringify(lead)
        });

        if (!response.success) {
            return NextResponse.json({
                error: response.error,
                details: response.details
            }, { status: 500 });
        }

        const scoringResult = response.data;

        // Update Lead with score and reason
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                score: scoringResult.score,
                score_reason: scoringResult.reason
            })
            .eq('id', leadId);

        if (updateError) {
            console.error('Failed to update lead score:', updateError);
            return NextResponse.json({ error: 'Failed to update lead database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: scoringResult });

    } catch (error: any) {
        console.error('Scoring API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}
