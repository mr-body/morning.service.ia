const fs = require("fs");
const csv = require("csv-parser");
const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs-node");

const knowledgeBase = [];

// Leitura do CSV
async function loadKnowledgeBase() {
    return new Promise((resolve, reject) => {
        fs.createReadStream("knowledge.csv")
            .pipe(csv())
            .on("data", (row) => {
                knowledgeBase.push({ id: row.id, content: row.content });
            })
            .on("end", () => {
                console.log("Base de conhecimento carregada!");
                resolve();
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

// Geração da Resposta
async function generateResponse(query) {
    await loadKnowledgeBase();
    const model = await use.load();
    const queryEmbedding = await model.embed([query]);
    const knowledgeEmbeddings = await model.embed(knowledgeBase.map(doc => doc.content));

    const similarities = [];
    for (let i = 0; i < knowledgeBase.length; i++) {
        const similarity = cosineSimilarity(queryEmbedding.arraySync()[0], knowledgeEmbeddings.arraySync()[i]);
        similarities.push({ id: knowledgeBase[i].id, content: knowledgeBase[i].content, similarity });
    }

    similarities.sort((a, b) => b.similarity - a.similarity);

    if (similarities.length === 0 || similarities[0].similarity === 0) {
        return null;
    }

    return similarities.slice(0, 3).map(res => ({
        id: res.id,
        content: res.content,
        similarity: res.similarity.toFixed(2)
    }));
}

// Função para calcular a similaridade de cosseno
function cosineSimilarity(vecA, vecB) {
    const dotProduct = tf.dot(vecA, vecB).dataSync();
    const normA = tf.norm(vecA).dataSync();
    const normB = tf.norm(vecB).dataSync();
    return dotProduct / (normA * normB);
}

// Consulta do Usuário
const userQuery = "como e chama o seu criador";
generateResponse(userQuery).then((response) => {
    if (response === null) {
        console.log("Desculpe, não consegui encontrar informações relevantes para sua consulta.");
    } else {
        console.log(response);
    }
}).catch((error) => console.error(error));
