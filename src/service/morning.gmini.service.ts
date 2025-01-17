import { GoogleGenerativeAI } from '@google/generative-ai';
import { TalkModule } from '../module/gmini.init.talk.module'

class GenerativeAI {
    private apiKey: string;
    private model: any;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('API Key is required');
        }
        this.apiKey = apiKey;

        const genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro-latest',
        });
    }

    async question(text: string, knowledge: { knowledge: string }[] = []): Promise<string> {

        let data = TalkModule;

        if (knowledge && knowledge.length > 0) {
            knowledge.map((dataKnowledge) => {
                data.push({
                    role: "user",
                    parts: [
                        {
                            text: dataKnowledge.knowledge
                        }
                    ]
                })
            })
        }

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 0,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
        };

        const safetySettings = [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ];

        try {
            const chatSession = this.model.startChat({
                generationConfig,
                safetySettings,
                history: data,
            });

            const result = await chatSession.sendMessage(text);
            return result.response.text();
        } catch (error) {
            console.error('Error generating response:', (error as Error).message);
            throw new Error('Failed to generate response');
        }
    }
}

export default GenerativeAI;
