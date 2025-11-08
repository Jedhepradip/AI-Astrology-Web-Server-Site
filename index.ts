import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Gemini setup
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
});

const model = "gemini-2.5-pro";
const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  responseMimeType: "application/json",
};

// ✅ Astrology Prompt Function
const createAstrologyPrompt = (
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  questionText: string
): string => `
✨ ${name} साठी AI ज्योतिष भविष्यवाणी ✨
जन्म तारीख: ${birthDate}
जन्म वेळ: ${birthTime}
जन्मस्थान: ${birthPlace}
वापरकर्त्याचा प्रश्न: ${questionText}

वरील माहितीच्या आधारे वैदिक ज्योतिषाच्या तत्वांनुसार ग्रहस्थितीचे सखोल विश्लेषण करा.
भावनिक, आध्यात्मिक आणि सविस्तर मराठी भाषेत उत्तर द्या.
उत्तरात उपाय, शुभ काळ आणि सकारात्मक मार्गदर्शन द्या.
उत्तराचा फॉरमॅट असा असावा 👇
🌠 भविष्यवाणी: <तुमचं सविस्तर उत्तर मराठीत>.
`;

// ✅ POST route
app.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, birthDate, birthTime, birthPlace, question } = req.body;

    const prompt = createAstrologyPrompt(
      name || "वापरकर्ता",
      birthDate || "१ जानेवारी २०००",
      birthTime || "सकाळी १०:००",
      birthPlace || "पुणे",
      question || "माझं भविष्य कसं असेल?"
    );

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    try {
      // ✅ First attempt
      const result = await ai.models.generateContent({ model, contents, config });
      console.log("result ", result);
      res.status(200).json({
        success: true,
        // message: text,
      });
    } catch (error: any) {
      if (error.status === 503) {
        console.warn("⚠️ Model overloaded. Retrying after 2s...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const retryResult = await ai.models.generateContent({ model, contents, config });
        console.log("retryResult ", retryResult);

        res.status(200).json({
          success: true,
          // message: text,
          retry: true,
        });
      } else {
        throw error;
      }
    }
    res.send({ message: "aaaa" })
  } catch (err) {
    console.error("❌ Final error:", err);
    res.status(503).json({
      success: false,
      error: "AI model is overloaded or failed. Try again shortly.",
    });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${4000}`);
});
