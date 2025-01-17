import { Request, Response } from "express";
import dotenv from "dotenv";
import GenerativeAI from "../service/morning.gmini.service";
import knowledge from "../../knowledge.json";

dotenv.config();

export const morning = async (req: Request, res: Response): Promise<void> => {
    const userInput = req.body.prompt;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    const generateAIResponse = new GenerativeAI(apiKey);

    try {
        const response = await generateAIResponse.question(userInput, knowledge);
        console.log(response);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate AI response" });
    }
}