const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Caminho do arquivo JSON
const filePath = path.join(__dirname, '../knowledge.json');

// Interface de readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para adicionar dados ao arquivo JSON
function addKnowledge(data) {
    // Verificar se o arquivo JSON existe
    if (fs.existsSync(filePath)) {
        // Ler o conteúdo atual do arquivo
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Adicionar o novo dado
        jsonData.push(data);

        // Salvar o arquivo atualizado
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
        console.log('Novo dado adicionado com sucesso!');
    } else {
        console.log('Arquivo JSON não encontrado.');
    }
}

// Perguntar ao usuário pelo novo conhecimento
rl.question('Digite o novo conhecimento: ', (answer) => {
    const newData = {
        knowledge: answer
    };

    // Executar a função
    addKnowledge(newData);

    // Fechar a interface readline
    rl.close();
});
