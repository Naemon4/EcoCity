const fs = require('fs');

function escreveNoJson(dados, filePath) {
    try {
        fs.writeFile(filePath, JSON.stringify(dados, null, 2), (writeErr) => {
            if (writeErr) {
                const error = new Error('Erro ao salvar o usuário.');
                error.statusCode = 500;
                throw error;
            }
            return { success: true, message: 'Usuário cadastrado com sucesso!' }  
        });
    } catch (error) {
        console.error('Erro ao salvar o usuário:', error);
        throw error;
    }
}

module.exports = { escreveNoJson };