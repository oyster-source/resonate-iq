
'use server'

import { resend } from '@/lib/email/client'
import { processCampaigns } from '@/lib/campaigns/engine'

export async function sendTestEmail(formData: FormData) {
    const to = formData.get('to') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!to || !subject || !message) {
        return { error: 'Missing required fields' }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Default test domain
            to: to,
            subject: subject,
            html: `<p>${message}</p>`
        })

        if (error) {
            console.error('Resend Error:', error)
            return { error: error.message }
        }

        return { success: true, data }
    } catch (e) {
        console.error('Unexpected Error:', e)
        return { error: 'Failed to send email' }
    }
}

export async function runCampaignProcessor() {
    try {
        const result = await processCampaigns();
        // Return simple serializable data
        return { success: true, processed: result.processed, details: result.details };
    } catch (e) {
        console.error('Processor Error:', e);
        return { error: 'Failed to run processor' };
    }
}
