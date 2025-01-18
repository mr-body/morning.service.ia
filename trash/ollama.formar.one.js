const axios = require('axios');
const readline = require('readline');

async function GenerativeAI(prompt, keys, description) {
    const data = {
        model: "llama3.2",
        messages: [
            {
                role: "user",
                content: `${prompt}? Retorne uma JSON as seguintes chaves: ${keys.join(', ')}, contendo valores do tipo: ${description.join(', ')}`
            }
        ],
        stream: false,
        format: "json",
        options: {
            temperature: 0
        }
    };

    try {
        const response = await axios.post('http://localhost:11434/api/chat', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const messageContent = response.data.message.content;
        return JSON.parse(messageContent);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Configura o readline para capturar a entrada do usuário no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Pergunta: ', async (prompt) => {
    const keys = ['pais', 'continente', 'presidete'];
    const description = ['nome do apis', 'localizacao', 'governante'];

    // Chama a função async para obter os dados
    const data = await GenerativeAI(prompt, keys, description);

    if (data) {
        printData(data);
    } else {
        console.log('Nenhum dado retornado.');
    }

    function printData(data) {
        console.log(data);

    }

    // Fecha o readline após a execução
    rl.close();
});
