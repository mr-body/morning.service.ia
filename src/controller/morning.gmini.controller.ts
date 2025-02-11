import { Request, Response } from "express";
import dotenv from "dotenv";
import GenerativeAI from "../service/morning.gmini.service";
import PromptAI from "../service/morning.gmini.json.service";
import DeepSearch from "../service/morning.deep.search.service";
import knowledge from "../knowledges/knowledge.json";
import { sendWhatsapp } from "../module/twilio.module";

dotenv.config();

export const morning_quest = async (req: Request, res: Response): Promise<void> => {
    const userInput = req.body.prompt;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    const generateAIResponse = new GenerativeAI(apiKey);
    const deepSearch = new DeepSearch(knowledge);

    const archive = deepSearch.findSimilarity(userInput);

    try {
        const response = await generateAIResponse.question(userInput, knowledge);
        res.status(200).json({ response, archive });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate AI response" });
    }
}

export const morning_prompt = async (req: Request, res: Response): Promise<void> => {
    const userInput = req.body.prompt;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    const generateAIResponse = new PromptAI(apiKey);

    try {
        const response = await generateAIResponse.prompt(userInput, knowledge);
        console.log(response);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate AI response" });
    }
}

export const morning_whatsapp = async (req: Request, res: Response): Promise<void> => {
    const messageBody = req.body.Body;
    const senderNumber = req.body.From;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key is not defined" });
        return;
    }

    const generateAIResponse = new GenerativeAI(apiKey);

    const response = await generateAIResponse.question(messageBody, knowledge);

    sendWhatsapp(senderNumber, response);

    res.send('<Response></Response>'); // Responde com um XML vazio para Twilio
}