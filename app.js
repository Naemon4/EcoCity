// Importando o módulo Express
const express = require('express');
const path = require('path');

// Inicializando a aplicação Express
const app = express();

// Definindo a porta onde o servidor irá rodar
const port = 3000;

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal que serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);

});
