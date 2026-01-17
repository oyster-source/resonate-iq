
import { SendingAccount, EmailContent, SendResult } from '../email/types';
import { MockProvider } from '../email/providers/mock-provider';

export class SenderEngine {
    private accounts: SendingAccount[];
    private provider: MockProvider; // In real app, this would be a factory or map of providers

    constructor(initialAccounts: SendingAccount[]) {
        this.accounts = initialAccounts;
        this.provider = new MockProvider();
    }

    /**
     * Selects the best account to send from (Round-robin logic emphasizing unused limits)
     */
    private selectAccount(): SendingAccount | null {
        // Sort accounts by:
        // 1. Has remaining daily limit
        // 2. Least recently used (or lowest send count today)
        const availableAccounts = this.accounts.filter(acc => acc.sentCount < acc.dailyLimit);

        if (availableAccounts.length === 0) return null;

        // Simple strategy: Pick the one with the lowest sentCount
        availableAccounts.sort((a, b) => a.sentCount - b.sentCount);

        return availableAccounts[0];
    }

    async sendCampaignEmail(campaignId: string, leadId: string, content: EmailContent): Promise<SendResult> {
        const account = this.selectAccount();

        if (!account) {
            console.warn(`[SenderEngine] No accounts available (Limits reached for all).`);
            return { success: false, error: 'Daily limits reached', provider: 'system' };
        }

        try {
            const result = await this.provider.sendEmail(account, content);

            if (result.success) {
                // Update local state (in a real app, this would update the DB)
                account.sentCount++;
                account.lastSentAt = new Date();

                // TODO: Update 'emails' table in database via API/Supabase call
            }

            return result;
        } catch (error) {
            console.error(`[SenderEngine] Failed to send:`, error);
            return { success: false, error: String(error), provider: 'system' };
        }
    }
}
