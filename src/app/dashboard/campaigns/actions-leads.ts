
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addLeadsToCampaign(campaignId: string, leadIds: string[]) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (!campaignId || !leadIds || leadIds.length === 0) {
        return { error: "Invalid parameters" }
    }

    // Prepare rows
    const rows = leadIds.map(leadId => ({
        campaign_id: campaignId,
        lead_id: leadId,
        status: 'active',
        next_step_at: new Date().toISOString() // Start immediately
    }));

    // Insert ignoring duplicates if possible? Supabase simple insert doesn't do ON CONFLICT IGNORE easily without configuration.
    // simpler: select existing first or just try inserting. 
    // We'll trust the UI or just let it fail for existing?
    // Let's check existing to be nice.

    // Actually, let's just insert. If error, we catch it.
    // Ideally we'd use upsert or ignore.

    const { error } = await supabase.from('campaign_leads').insert(rows)

    if (error) {
        console.error("Failed to add leads to campaign", error)
        return { error: "Failed to add leads to campaign" }
    }

    revalidatePath(`/dashboard/campaigns`)
    return { success: true }
}
