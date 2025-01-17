import axios from 'axios';
import { TalkModule } from '../module/ollama.init.talk.module'

/**
 * Objeto de dados contendo a configuração para o modelo 'llama3'.
 * 
 * @property {string} model - O modelo a ser usado, neste caso 'llama3'.
 * @property {Array<{ role: string, content: string }>} messages - Uma matriz de objetos de mensagem, cada um contendo um papel e conteúdo.
 * @property {Object} options - Opções de configuração para o modelo.
 * @property {number} options.seed - Valor da semente para geração de números aleatórios.
 * @property {number} options.top_k - O número de tokens de vocabulário de maior probabilidade a serem mantidos para amostragem top-k.
 * @property {number} options.top_p - O limite de probabilidade cumulativa para amostragem de núcleo.
 * @property {number} options.temperature - Temperatura de amostragem.
 * @property {number} options.repeat_penalty - Penalidade para repetição de tokens.
 * @property {number} options.presence_penalty - Penalidade para a presença de tokens.
 * @property {number} options.frequency_penalty - Penalidade para a frequência de tokens.
 * @property {number} options.mirostat - Parâmetro de amostragem Mirostat.
 * @property {number} options.mirostat_tau - Parâmetro tau do Mirostat.
 * @property {number} options.mirostat_eta - Parâmetro eta do Mirostat.
 * @property {boolean} options.penalize_newline - Se deve penalizar novas linhas.
 * @property {Array<string>} options.stop - Matriz de sequências de parada.
 * @property {boolean} options.numa - Se deve usar NUMA.
 * @property {number} options.num_ctx - Número de tokens de contexto.
 * @property {number} options.num_batch - Número de lotes.
 * @property {number} options.num_gpu - Número de GPUs a serem usadas.
 * @property {number} options.main_gpu - Índice da GPU principal a ser usada.
 * @property {boolean} options.low_vram - Se deve usar o modo de baixa VRAM.
 * @property {boolean} options.vocab_only - Se deve usar apenas o vocabulário.
 * @property {boolean} options.use_mmap - Se deve usar arquivos mapeados na memória.
 * @property {boolean} options.use_mlock - Se deve bloquear a memória.
 * @property {number} options.num_thread - Número de threads a serem usadas.
 */
        

class Ollama {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async *generate(prompt: string, knowledge: { knowledge: string }[] = []): AsyncGenerator<string, void, unknown> {
        let data = TalkModule;
        if (knowledge && knowledge.length > 0) {
            knowledge.forEach((dataKnowledge) => {
            data.push({
                role: 'user',
                content: dataKnowledge.knowledge,
                images: null
            });
            data.push({
                role: 'assistant',
                content: "arquivado",
                images: null
            });
            });
        }

        data.push({
            role: 'user',
            content: "ok, vamos começar a conversa simulada:",
            images: null
        });

        console.log('Prompt:', prompt);
        console.log('Data:', data);

        const config = {
            model: 'llama3',
            messages: [
                ...data, // Preload messages from TalkModule and knowledge
                { 
                    role: 'user',
                    content: `${prompt}`,
                    images: null
                }
            ],
            "options": {
                // "seed": 42,
                "top_k": 0,
                "top_p": 0.95,
                "temperature": 0.8,
                "stop": ["\n", "user:"],
                "num_thread ": 8
                // "repeat_penalty": 1.2,
                // "presence_penalty": 1.5,
                // "frequency_penalty": 1.0,
                // "mirostat": 1,
                // "mirostat_tau": 0.8,
                // "mirostat_eta": 0.6,
                // "penalize_newline": true,
                // "numa": false,
                // "num_ctx": 1024,
                // "num_batch": 2,
                // "num_gpu": 1,
                // "main_gpu": 0,
                // "low_vram": false,
                // "vocab_only": false,
                // "use_mmap": true,
                // "use_mlock": false,
            }
        };

        try {
            // Sending the POST request
            const response = await axios.post(this.url, config, { responseType: 'stream' });
            let fullResponse = ''; // Variable to store the complete response

            // Processing the response line by line
            for await (const chunk of response.data) {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (line) {
                        try {
                            // Decodes and processes each JSON line
                            const decodedLine = JSON.parse(line);

                            // Checks if there is a message from the assistant
                            if (decodedLine.message && decodedLine.message.content) {
                                // Concatenates the partial response from the assistant
                                fullResponse += decodedLine.message.content;
                                // Returns the part of the response for streaming
                                yield JSON.stringify({ response: decodedLine.message.content }) + '\n';
                            }

                            // Checks if the processing is complete
                            if (decodedLine.done) {
                                break;
                            }
                        } catch (error) {
                            console.error('Error decoding JSON:', line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error generating response:', (error as Error).message);
        }
    }
}

export default Ollama;
