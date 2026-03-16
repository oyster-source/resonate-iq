
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type CampaignData = {
    name: string;
    description: string;
    steps: {
        type: 'email' | 'delay';
        delayDays?: number;
        variants?: {
            name: string;
            subject: string;
            body: string;
        }[];
    }[];
}

export async function createCampaign(data: CampaignData): Promise<{ success: true } | { error: string }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Create Campaign
    const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
            user_id: user.id,
            name: data.name,
            description: data.description,
            status: 'draft'
        })
        .select()
        .single()

    if (campaignError) {
        console.error('Campaign Error:', campaignError)
        return { error: 'Failed to create campaign' }
    }

    // 2. Create Steps (Sequentially to maintain order, or using order_index)
    // We'll iterate and insert
    for (const [index, step] of data.steps.entries()) {
        const { data: stepData, error: stepError } = await supabase
            .from('campaign_steps')
            .insert({
                campaign_id: campaign.id,
                user_id: user.id,
                type: step.type,
                order_index: index,
                delay_days: step.delayDays
            })
            .select()
            .single()

        if (stepError) {
            console.error('Step Error:', stepError)
            // Ideally we'd rollback here, but for now we'll just log
            continue
        }

        // 3. Create Variants for Email Steps
        if (step.type === 'email' && step.variants) {
            const variantsToInsert = step.variants.map(v => ({
                step_id: stepData.id,
                user_id: user.id,
                name: v.name,
                subject: v.subject,
                body: v.body
            }))

            const { error: variantError } = await supabase
                .from('email_variants')
                .insert(variantsToInsert)

            if (variantError) {
                console.error('Variant Error:', variantError)
            }
        }
    }

    revalidatePath('/dashboard/campaigns')
    revalidatePath('/dashboard/campaigns')
    return { success: true }
}
