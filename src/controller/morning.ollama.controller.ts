import { Request, Response } from "express";
import dotenv from "dotenv";
import Ollama from '../service/morning.ollama.service';
import knowledge from "../knowledges/knowledge.json";

dotenv.config();

export const morning = async (req: Request, res: Response): Promise<void> => {
    const userInput = req.body.prompt;
    const ollamaUrl = process.env.OLLAMA_API_HOST;

    console.log(`Received request with input: ${userInput}`);
    

    console.log("here ", ollamaUrl)

    if (!ollamaUrl) {
        res.status(500).json({ error: "Ollama URL is not defined" });
        return;
    }

    const ollama = new Ollama(ollamaUrl);

    try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of ollama.generate(userInput, knowledge)) {
            console.log(`Sending chunk: ${chunk} Chunk length: ${chunk.length}`);
            res.write(chunk);
        }

        res.end();
    } catch (error) {
        res.status(500).json({ error: "Failed to stream AI response" });
    }
};