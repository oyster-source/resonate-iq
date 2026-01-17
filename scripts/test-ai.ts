
// Scripts to test AI logic (without UI)
// Run via: npx tsx scripts/test-ai.ts

import { analyzeProfile } from '../src/lib/services/detective';
import { generateSequence } from '../src/lib/services/email-generator';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    console.log("🚀 Starting AI Engine Test...");

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.warn("⚠️  WARNING: GOOGLE_GENERATIVE_AI_API_KEY is missing in .env.local");
        console.warn("   Skipping actual AI calls to prevent crash.");
        console.warn("   Please add your key to run the full test.");
        return;
    }

    // 1. Test Detective (Gemini)
    const mockProfile = "John Doe is a CEO at TechCorp. He posts about scaling teams and AI automation.";
    console.log("\n🕵️  Running Detective on mock profile...");

    try {
        const dossier = await analyzeProfile(mockProfile);
        console.log("✅ Dossier Generated:", JSON.stringify(dossier, null, 2));

        // 2. Test Email Generator (OpenAI)
        if (!process.env.OPENAI_API_KEY) {
            console.warn("\n⚠️  WARNING: OPENAI_API_KEY is missing. Skipping email generation.");
            return;
        }

        console.log("\n📧 Generating Email Sequence...");
        const offer = "We help agencies scale with AI.";
        const sequence = await generateSequence(dossier, offer);
        console.log("✅ Sequence Generated:", JSON.stringify(sequence, null, 2));

    } catch (error) {
        console.error("❌ Error during AI test:", error);
    }
}

main();
