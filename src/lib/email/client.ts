
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.warn("Missing RESEND_API_KEY environment variable. Emails will not be sent.");
}

export const resend = new Resend(apiKey || 're_mock_key');
