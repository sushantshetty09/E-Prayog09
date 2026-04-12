import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

let ai: GoogleGenAI | null = null;
try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (e) {
  console.warn('Gemini AI init failed:', e);
}

const SYSTEM_PROMPT = `You are E-Prayog AI Tutor — a friendly, expert science tutor built into the E-Prayog Virtual Science Lab platform for Karnataka PUC (Pre-University Course) students.

Your role:
- Help students understand Physics, Chemistry, Biology, Mathematics, and Computer Science experiments.
- Provide clear, step-by-step explanations aligned with the Karnataka PUC syllabus.
- When a student is inside a specific experiment, you will be provided context about that experiment (aim, theory, procedure, formulas, viva questions). Use this context to give highly relevant answers.
- Use simple language. Offer analogies and real-world examples familiar to Indian students.
- When asked about formulas, write them clearly. Use markdown formatting for emphasis.
- If asked about something outside science/academics, politely redirect.
- Be encouraging and patient. Use occasional Kannada phrases where appropriate (e.g., "ಚೆನ್ನಾಗಿ ಮಾಡಿದ್ದೀರಿ!" — Well done!).

Always respond in markdown format.`;

export function createChatSession(labContext?: string): Chat | null {
  if (!ai) return null;

  let contextPrompt = SYSTEM_PROMPT;
  if (labContext) {
    contextPrompt += `\n\n--- CURRENT EXPERIMENT CONTEXT ---\n${labContext}\n--- END CONTEXT ---\n\nUse the above experiment context to give targeted, specific help. If the student asks about this experiment, refer to the exact aim, theory, procedure, and formulas provided.`;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });
    return chat;
  } catch (e) {
    console.error('Failed to create chat session:', e);
    return null;
  }
}

export async function sendMessageToGemini(chat: Chat, message: string) {
  const result = await chat.sendMessageStream({ message });
  return result;
}

export async function askTutor(question: string, labContext?: string): Promise<string> {
  if (!ai) return 'AI Tutor is not configured. Please set the GEMINI_API_KEY environment variable.';

  let prompt = SYSTEM_PROMPT;
  if (labContext && labContext !== 'General') {
    prompt += `\n\nCurrent lab context: ${labContext}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: question,
      config: {
        systemInstruction: prompt,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });
    return response.text || 'I could not generate a response. Please try again.';
  } catch (e: any) {
    console.error('Gemini askTutor error:', e);
    return `Error: ${e.message || 'Failed to get response from AI.'}`;
  }
}
