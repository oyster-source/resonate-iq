
import { SenderEngine } from '../src/lib/services/sender-engine';
import { SendingAccount, EmailContent } from '../src/lib/email/types';

async function main() {
    console.log("🚀 Starting Email Sender Test...");

    // Mock Accounts
    const accounts: SendingAccount[] = [
        { id: '1', email: 'alex@domain1.com', name: 'Alex 1', provider: 'mock', dailyLimit: 3, sentCount: 0 },
        { id: '2', email: 'alex@domain2.com', name: 'Alex 2', provider: 'mock', dailyLimit: 2, sentCount: 0 }
    ];

    const engine = new SenderEngine(accounts);

    // Send 6 emails (should exhaust limits)
    for (let i = 1; i <= 6; i++) {
        console.log(`\n📨 Attempting to send Email #${i}...`);

        const content: EmailContent = {
            to: `lead${i}@example.com`,
            subject: `Hello ${i}`,
            body: `This is a test email ${i}`
        };

        const result = await engine.sendCampaignEmail('camp-1', `lead-${i}`, content);

        if (result.success) {
            console.log(`✅ Sent successfully via ${result.provider} (ID: ${result.messageId})`);
        } else {
            console.log(`❌ Failed: ${result.error}`);
        }
    }

    console.log("\n📊 Final Account Status:");
    accounts.forEach(acc => {
        console.log(`Account ${acc.email}: ${acc.sentCount}/${acc.dailyLimit} sent`);
    });
}

main();
