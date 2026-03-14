import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processCampaigns } from '@/lib/campaigns/engine';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { campaignId } = body;

        // In the centralized engine, we might want to filter by campaignId.
        // For now, processCampaigns processes all due leads across all active campaigns.
        // If campaignId is provided, we could pass it to processCampaigns if we refactor it further.
        // For development simplicity, we'll run the full engine.

        const result = await processCampaigns();

        return NextResponse.json({
            success: true,
            processed: result.processed,
            details: result.details
        });

    } catch (error: any) {
        console.error('Campaign Execution Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
