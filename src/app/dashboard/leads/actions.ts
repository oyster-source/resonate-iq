
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type LeadInput = {
    linkedin_url?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    title?: string;
}

export async function addLeads(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const leadsJson = formData.get('leads') as string

    if (!leadsJson) {
        return { error: "No data provided" }
    }

    let leads: LeadInput[] = [];
    try {
        leads = JSON.parse(leadsJson);
    } catch (e) {
        console.error("Failed to parse leads JSON", e);
        return { error: "Invalid data format" }
    }

    if (leads.length === 0) return { error: "No leads found" }

    const leadsToInsert = leads.map(lead => ({
        user_id: user.id,
        linkedin_url: lead.linkedin_url || "",
        email: lead.email || null, // Ensure email column exists or put in enrichment_data if not
        // We'll put name/company/title into enrichment_data for now unless we add columns
        enrichment_data: {
            first_name: lead.first_name,
            last_name: lead.last_name,
            company: lead.company,
            title: lead.title
        },
        status: 'pending'
    })).filter(l => l.linkedin_url || l.email); // Must have at least URL or Email

    if (leadsToInsert.length === 0) {
        return { error: "No valid leads found (missing URL or Email)" }
    }

    const { error } = await supabase.from('leads').insert(leadsToInsert)

    if (error) {
        console.error('Error adding leads:', error)
        return { error: 'Failed to add leads' }
    }

    revalidatePath('/dashboard/leads')
    return { success: true, count: leadsToInsert.length }
}
