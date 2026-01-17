
// Note: In a real implementation this would perform database transactions via Supabase
// For this scratchpad environment without a live DB connection, we mock the logic.

interface UserProfile {
    id: string;
    credits: number;
}

// Mock database state
const mockDb: Record<string, UserProfile> = {
    'user_123': { id: 'user_123', credits: 10 }
};

export class BillingService {

    /**
     * Checks if a user has enough credits for an action.
     */
    async checkCredits(userId: string, cost: number): Promise<boolean> {
        const user = mockDb[userId]; // In real app: await supabase.from('profiles').select('credits')...
        if (!user) return false;

        return user.credits >= cost;
    }

    /**
     * Deducts credits from a user. Throws error if insufficient.
     */
    async deductCredits(userId: string, cost: number): Promise<number> {
        const hasCredits = await this.checkCredits(userId, cost);
        if (!hasCredits) {
            throw new Error("Insufficient credits");
        }

        mockDb[userId].credits -= cost; // In real app: await supabase.rpc('deduct_credits', { amount: cost })

        console.log(`[BillingService] Deducted ${cost} credits. Remaining: ${mockDb[userId].credits}`);
        return mockDb[userId].credits;
    }

    /**
     * (Debug) Get current credits
     */
    async getCredits(userId: string): Promise<number> {
        return mockDb[userId]?.credits ?? 0;
    }
}

export const billingService = new BillingService();
