import type { Request, Response } from "express";
import { User } from "../Models/user.model.js";
import axios from "axios";


const createAstrologyPrompt = (name: string | undefined, birthDate: Date | undefined, birthTime: string | undefined, birthPlace: string | undefined, userQuestion: string) =>
    `✨ AI Astrology Reading for ${name || "User"} ✨ | Date of Birth: ${birthDate} | Time of Birth: ${birthTime} | Place of Birth: ${birthPlace} | User’s Question: ${userQuestion} | Analyze these details using Vedic astrology principles and give a detailed, emotional, and spiritual answer with remedies and positive guidance. Format your response like: 🌠 Astrology Prediction: <your detailed answer>.`;


export const postQuestion = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.userId;
        const { questionText } = req.body;

        if (!questionText) {
            res.status(400).json({ message: "Question text is required" });
            return;
        }

        const user = await User?.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        const { name, birthDate, birthTime, birthPlace } = user;

        if (!name || !birthDate || !birthTime || !birthPlace) {
            res.status(400).json({ message: "Incomplete birth details for astrology reading" });
            return;
        }

        const prompt = createAstrologyPrompt(name, birthDate, birthTime, birthPlace, questionText);
    
        const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "You are an expert astrologer." },
            { role: "user", content: prompt }]
        }, {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        console.log("aiResponse ", aiResponse);



        res.status(201).json({ message: "Question posted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}