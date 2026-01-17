
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

// Initialize the Google Generative AI provider
export const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Initialize the OpenAI provider
export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Export specific models we want to use
export const detectiveModel = google('models/gemini-1.5-flash-latest');
export const copywriterModel = openai('gpt-4o-mini');
