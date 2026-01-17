
import { billingService } from '../src/lib/services/billing-service';

async function main() {
    console.log("🚀 Starting Billing Service Test...");

    const userId = 'user_123';

    // 1. Check Initial Balance
    const initial = await billingService.getCredits(userId);
    console.log(`Initial Credits: ${initial}`);

    // 2. Perform Action (Cost: 5)
    console.log("\nAttempting action (Cost: 5)...");
    try {
        const remaining = await billingService.deductCredits(userId, 5);
        console.log(`✅ Success! Remaining: ${remaining}`);
    } catch (e) {
        console.log(`❌ Failed: ${e}`);
    }

    // 3. Perform Action (Cost: 6) - Should Fail
    console.log("\nAttempting action (Cost: 6)...");
    try {
        const remaining = await billingService.deductCredits(userId, 6);
        console.log(`✅ Success! Remaining: ${remaining}`);
    } catch (e) {
        console.log(`❌ Failed (Expected): ${e}`);
    }
}

main();
