// import type { Request, Response } from "express";
// import axios from "axios";
// import { User } from "../Models/user.model.js";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY as string,
// });

// const model = "gemini-2.5-pro";

// const createAstrologyPrompt = (
//   name: string | undefined,
//   birthDate: Date | undefined,
//   birthTime: string | undefined,
//   birthPlace: string | undefined,
//   userQuestion: string
// ): string => {
//   return `✨ **AI Astrology Reading for ${name || "User"}** ✨  
// 🗓️ **Date of Birth:** ${birthDate || "Unknown"}  
// ⏰ **Time of Birth:** ${birthTime || "Unknown"}  
// 📍 **Place of Birth:** ${birthPlace || "Unknown"}  
// 💭 **User’s Question:** ${userQuestion}  

// Analyze these details using **Vedic astrology principles** and provide a **detailed, emotional, and spiritual answer**.  
// Include **remedies, planetary insights, and positive guidance**.  
// Format your answer like:  
// 🌠 **Astrology Prediction:** <your detailed response>.`;
// };


// export const postQuestion = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = (req as any).userId;
//     const { questionText } = req.body;

//     if (!questionText) {
//       res.status(400).json({ message: "Question text is required" });
//       return;
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const { name, birthDate, birthTime, birthPlace } = user;

//     if (!name || !birthDate || !birthTime || !birthPlace) {
//       res.status(400).json({
//         message: "Incomplete birth details for astrology reading",
//       });
//       return;
//     }

//     const prompt = createAstrologyPrompt(
//       name,
//       birthDate,
//       birthTime,
//       birthPlace,
//       questionText
//     );

//     const contents = [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ];

//     const config = {
//       thinkingConfig: { thinkingBudget: -1 },
//       responseMimeType: "application/json",
//     };

//     try {
//       const result = await ai.models.generateContent({ model, contents, config });
//       const parsed = JSON.parse(result.text as string);
//       console.log("Parsed :", parsed);
//       res.status(201).json({
//         message: "AI astrology reading generated successfully",
//         data: parsed,
//       });
//     } catch (error: any) {
//       if (error.status === 503) {
//         console.warn("⚠️ Model overloaded. Retrying after 2s...");
//         await new Promise((resolve) => setTimeout(resolve, 2000));

//         const retryResult = await ai.models.generateContent({ model, contents, config });
//         const parsed = JSON.parse(retryResult.text as string);
//         console.log("Parsed :", parsed);

//         res.status(201).json({
//           message: "AI astrology reading generated successfully (after retry)",
//           data: parsed,
//         });
//       } else {
//         throw error;
//       }
//     }
//   } catch (err) {
//     console.error("❌ Final error:", err);
//     res.status(503).json({
//       message: "AI model is overloaded or failed. Try again shortly.",
//       error: err instanceof Error ? err.message : err,
//     });
//   }
// };










import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  // apiKey: process.env.GOOGLE_API_KEY as string,
  apiKey: 'AIzaSyCcy2pxT0jbZu2OHipxdZpe_7AkOYwleAs'
});

const model = "gemini-2.5-pro";

const createAstrologyPrompt = (
  name: string | undefined,
  birthDate: Date | undefined,
  birthTime: string | undefined,
  birthPlace: string | undefined,
  userQuestion: string
): string => {
  return `✨ **AI Astrology Reading for ${name || "User"}** ✨  
🗓️ **Date of Birth:** ${birthDate || "Unknown"}  
⏰ **Time of Birth:** ${birthTime || "Unknown"}  
📍 **Place of Birth:** ${birthPlace || "Unknown"}  
💭 **User’s Question:** ${userQuestion}  

Analyze these details using **Vedic astrology principles** and provide a **detailed, emotional, and spiritual answer**.  
Include **remedies, planetary insights, and positive guidance**.  
Format your answer like:  
🌠 **Astrology Prediction:** <your detailed response>.`;
};

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  responseMimeType: "application/json",
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    // 💬 Get user's question
    // const { questionText } = req.body;

    // if (!questionText) {
    //   res.status(400).json({ message: "Question text is required" });
    //   return;
    // }

    // 🪄 Create dynamic dummy data (you can replace this with real user data)
    const name = "Aarav";
    const birthDate = new Date("2000-08-15");
    const birthTime = "10:30 AM";
    const birthPlace = "Pune";
    const questionText = 'Will I be successful in business or job'

    // 🧠 Create astrology prompt
    const prompt = createAstrologyPrompt(name, birthDate, birthTime, birthPlace, questionText);

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    // 🪶 Try once
    try {
      const result = await ai.models.generateContent({ model, contents, config });

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      const astrology = JSON.parse(text as string);

      const cleanText = astrology
        .replace(/\\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/\*/g, "")
        .replace(/�/g, "")
        .trim();

      console.log("cleanText Prediction:", cleanText);

      if (!result) {
        res.status(500).json({ message: "AI returned no text" });
        return;
      }

      res.status(200).json({
        message: "AI astrology reading generated successfully",
        prompt,
        aiResponse: result,
        cleanText: cleanText
      });

    } catch (error: any) {
      if (error.status === 503) {
        console.warn("⚠️ Model overloaded. Retrying after 2s...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const retryResult = await ai.models.generateContent({ model, contents, config });

        const text = retryResult?.candidates?.[0]?.content?.parts?.[0]?.text;
        const astrology = JSON.parse(text as string);

        const cleanText = astrology
          .replace(/\\n/g, " ")
          .replace(/\n/g, " ")
          .replace(/\*/g, "")
          .replace(/�/g, "")
          .trim();

          
        console.log("cleanText Prediction:", cleanText);

        res.status(200).json({
          message: "AI astrology reading generated successfully (after retry)",
          prompt,
          aiResponse: retryResult,
          cleanText: cleanText
        });
      } else {
        throw error;
      }
    }
  } catch (err: any) {
    console.error("❌ Final error:", err);
    res.status(500).json({
      message: "Failed to generate AI astrology reading",
      error: err.message || err,
    });
  }
};
