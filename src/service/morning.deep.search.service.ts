import stringSimilarity from "string-similarity";

interface KnowledgeItem {
    knowledge: string;
    keywords: string[];
}

class DeepSearch {
    private knowledge: KnowledgeItem[];

    constructor(knowledge: KnowledgeItem[]) {
        this.knowledge = knowledge;
    }

    // Função para calcular a relevância com base em similaridade e palavras-chave
    private calculateRelevance(question: string, item: KnowledgeItem): number {
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
    }

    // Busca no JSON
    private searchKnowledge(question: string): KnowledgeItem[] {
        const results = this.knowledge
            .map(item => ({
                ...item,
                relevance: this.calculateRelevance(question, item),
            }))
            .filter(item => item.relevance > 0.3) // Filtra itens com relevância mínima
            .sort((a, b) => b.relevance - a.relevance); // Ordena por relevância

        return results;
    }

    public findSimilarity(question: string): KnowledgeItem[] {
        return this.searchKnowledge(question);
    }
}

export default DeepSearch;
