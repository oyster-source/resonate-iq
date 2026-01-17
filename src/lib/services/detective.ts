
import { detectiveModel } from '../ai/client';
import { generateObject } from 'ai';
import { z } from 'zod';

export const enrichmentSchema = z.object({
    summary: z.string().describe("A brief 2-sentence summary of the person's professional focus."),
    personality: z.object({
        disc_type: z.enum(['D', 'I', 'S', 'C']).describe("Dominant DISC personality type based on writing style"),
        tone: z.string().describe("Recommended communication tone (e.g., 'Direct and professional', 'Friendly and casual')"),
        keywords: z.array(z.string()).describe("5 keywords that resonate with them")
    }),
    pain_points: z.array(z.string()).describe("3 potential business pain points inferred from their role and industry"),
    motivations: z.array(z.string()).describe("3 professional motivations inferred from their bio"),
    ice_breaker: z.string().describe("A personalized opening line for an email based on a specific detail in their bio")
});

export async function analyzeProfile(profileText: string) {
    try {
        const { object } = await generateObject({
            model: detectiveModel,
            schema: enrichmentSchema,
            prompt: `Analyze the following LinkedIn profile text and construct a psychological dossier for sales outreach. 
      Focus on inferring their personality, pain points, and how to best communicate with them.
      
       PROFILE TEXT:
      "${profileText}"
      `,
        });

        return object;
    } catch (error) {
        console.error("Error analyzing profile:", error);
        throw error;
    }
}
