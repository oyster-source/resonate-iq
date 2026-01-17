
import { copywriterModel } from '../ai/client';
import { generateObject } from 'ai';
import { z } from 'zod';

export const emailSequenceSchema = z.object({
    emails: z.array(z.object({
        step: z.number().describe("Step number in the sequence (1, 2, or 3)"),
        subject: z.string().describe("Compelling subject line"),
        body: z.string().describe("Email body content. Use text, not HTML."),
        rationale: z.string().describe("Why this angle was chosen based on the dossier")
    })).length(3).describe("A 3-step email sequence")
});

export async function generateSequence(dossier: any, offer: string) {
    try {
        const { object } = await generateObject({
            model: copywriterModel,
            schema: emailSequenceSchema,
            prompt: `You are a world-class copywriter. Write a 3-step cold email sequence promoting the following OFFER to a lead with the provided ANALYZED DOSSIER.
      
      OFFER:
      "${offer}"
      
      LEAD DOSSIER:
      ${JSON.stringify(dossier, null, 2)}
      
      GUIDELINES:
      - Match the tone recommended in the dossier.
      - Use the ice_breaker from the dossier in the first email if appropriate.
      - Hit the pain points identified.
      - Keep it concise and low-friction.
      `,
        });

        return object;
    } catch (error) {
        console.error("Error generating sequence:", error);
        throw error;
    }
}
