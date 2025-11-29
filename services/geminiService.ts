import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const BRAINROT_SYSTEM_INSTRUCTION = `
You are a 'Brainrot' generator. You speak exclusively in extreme Gen Z / Alpha internet slang.
Vocabulary includes: Skibidi, Ohio, Rizz, Gyatt, Fanum Tax, Sigma, Grimace Shake, Mewing, Mogging, Edging (use carefully), Gooning (use carefully), Beta, L + Ratio, W, Cap, No Cap, Fr, Bussin, Sheesh.
Your goal is to be over-stimulating, nonsensical, and chaotic.
Keep responses short, punchy, and loud (ALL CAPS often).
`;

export const generateYapping = async (currentAura: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 1-sentence reaction to someone having ${currentAura} Aura points. Make it sound like a chaotic tiktok comment section.`,
      config: {
        systemInstruction: BRAINROT_SYSTEM_INSTRUCTION,
        maxOutputTokens: 50,
        temperature: 1.5, // High creativity/chaos
      },
    });
    return response.text || "SKIBIDI ERROR 404";
  } catch (error) {
    console.error("Gemini failed to yap:", error);
    return "SYSTEM ERROR: NOT ENOUGH RIZZ TO CONNECT";
  }
};

export const generateNewsTicker = async (): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate 5 breaking news headlines for a 'Brainrot' universe. Return them as a JSON list of strings.",
      config: {
        systemInstruction: BRAINROT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });
    const json = JSON.parse(response.text || "[]");
    return Array.isArray(json) ? json : ["OHIO INVADES FLORIDA", "SKIBIDI TOILET ELECTED PRESIDENT"];
  } catch (error) {
    return ["CONNECTION LOST TO THE MATRIX", "RECONNECTING TO OHIO..."];
  }
};