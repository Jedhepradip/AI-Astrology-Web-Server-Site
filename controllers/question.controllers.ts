import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const GOOGLE_API_KEY="AIzaSyBWKUAO13xU5NSEm4BM6FgOykMsuUw68gQ";

const ai = new GoogleGenAI({
  apiKey: GOOGLE_API_KEY,
});

const model = "gemini-2.5-pro";

const createAstrologyPrompt = (
  name: string,
  birthDate: Date,
  birthTime: string,
  birthPlace: string,
  questionText: string,
  duration: number
): string => {
  return `
Generate a beautiful astrology prediction prompt based on:

Name: ${name}
Date of Birth: ${birthDate}
Time of Birth: ${birthTime}
Place of Birth: ${birthPlace}
User Question: "${questionText}"
Duration: ${duration}

Return ONLY clean JSON:
{
  "aiAnswerText": "...", 
}
`;
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    // DUMMY DATA
    const name = "Aarav";
    const birthDate = new Date("2000-08-15");
    const birthTime = "10:30 AM";
    const birthPlace = "Pune";
    const duration = 30;
    const questionText = "Will I be successful in business or job?";

    const prompt = createAstrologyPrompt(
      name,
      birthDate,
      birthTime,
      birthPlace,
      questionText,
      duration
    );

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const config = {
      thinkingConfig: { thinkingBudget: -1 },
      responseMimeType: "application/json",
    };

    let result;

    try {
      result = await ai.models.generateContent({ model, contents, config });
    } catch (error: any) {
      if (error.status === 503) {
        console.log("Retrying after overload...");
        await new Promise((r) => setTimeout(r, 2000));
        result = await ai.models.generateContent({ model, contents, config });
      } else {
        throw error;
      }
    }

    // SAFELY EXTRACT TEXT
    const jsonText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const parsed = JSON.parse(jsonText);

    console.log("Parsed :",parsed);
    
     res.status(200).json({
      message: "AI astrology reading generated successfully",
      prompt,
      data: parsed,
    });
  } catch (err: any) {
    console.error(err);
     res.status(500).json({
      message: "Failed to generate astrology reading",
      error: err.message || err,
    });
  }
};
