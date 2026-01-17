
import { EmailProvider, SendingAccount, EmailContent, SendResult } from '../types';

export class MockProvider implements EmailProvider {
    async sendEmail(account: SendingAccount, content: EmailContent): Promise<SendResult> {
        console.log(`\n[MockProvider] Sending email from ${account.email}...`);
        console.log(`To: ${content.to}`);
        console.log(`Subject: ${content.subject}`);
        console.log(`Body Preview: ${content.body.substring(0, 50)}...`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            provider: 'mock'
        };
    }
}
