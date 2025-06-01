const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');
const fileUpload = require('express-fileupload');

// Importando rotas
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 3000;

// Configuração da sessão
app.use(session({
    secret: 'ecocity2025',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Rotas de páginas
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/meusPosts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'suasPostagens.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'post.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'perfil.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/editarPerfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'editarPerfil.html'));
});

app.get('/criarPost', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'criarPostagens.html'));
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Sincroniza os modelos com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Modelos sincronizados com o banco de dados');
        // Inicia o servidor após a sincronização
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro ao sincronizar modelos:', err);
    });
