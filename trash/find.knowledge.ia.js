const knowledge = require('../src/knowledges/knowledge.json');
const stringSimilarity = require("string-similarity");

let question = process.argv[2];

if (!question) {
    console.log("Por favor, forneça uma pergunta como argumento.");
    process.exit(1);
}

// Função para calcular a relevância com base em similaridade e palavras-chave
const calculateRelevance = (question, item) => {
    // Similaridade com o campo "knowledge"
    const knowledgeSimilarity = stringSimilarity.compareTwoStrings(
        question.toLowerCase(),
        item.knowledge.toLowerCase()
    );

    // Similaridade com palavras-chave
    const keywordsSimilarity = item.keywords.reduce((acc, keyword) => {
        return acc + stringSimilarity.compareTwoStrings(question.toLowerCase(), keyword.toLowerCase());
    }, 0) / item.keywords.length;

    // Média ponderada entre as duas similaridades
    return 0.7 * knowledgeSimilarity + 0.3 * keywordsSimilarity;
};

// Busca no JSON
const searchKnowledge = (question) => {
    const results = knowledge
        .map(item => ({
            ...item,
            relevance: calculateRelevance(question, item),
        }))
        .filter(item => item.relevance > 0.3) // Filtra itens com relevância mínima
        .sort((a, b) => b.relevance - a.relevance); // Ordena por relevância

    return results;
};

// Executar a busca
const results = searchKnowledge(question);

// Exibir os resultados
if (results.length > 0) {
    results.forEach((result, index) => {
        console.log(`Resultado ${index + 1} (Relevância: ${(result.relevance * 100).toFixed(2)}%):`);
        console.log("Knowledge:", result.knowledge);
        console.log("Source:", result.source || "Não disponível");
        console.log("Links:", result.link.length > 0 ? result.link : "Nenhum link");
        console.log("Images:", result.image.length > 0 ? result.image : "Nenhuma imagem");
        console.log("Videos:", result.video.length > 0 ? result.video : "Nenhum vídeo");
        console.log("Audios:", result.audio.length > 0 ? result.audio : "Nenhum áudio");
        console.log("Text:", result.text.length > 0 ? result.text : "Nenhum texto");
        console.log("Files:", result.file.length > 0 ? result.file : "Nenhum arquivo");
        console.log("-----------------------------------------------------");
    });
} else {
    console.log("Nenhum resultado encontrado para a pergunta fornecida.");
}
