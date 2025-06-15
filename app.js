const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');
const fileUpload = require('express-fileupload');

// Importando rotas
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 3000;

app.use(xss());

// Aplica todos os middlewares padrão de segurança
app.use(helmet());

// Configura a política de segurança de conteúdo (CSP)
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://apis.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
        },
    })
);

app.use(
    helmet.crossOriginResourcePolicy({ policy: "same-origin" })
);

app.use(
    helmet.frameguard({ action: 'deny' }) // Evita que sua página seja colocada em iframes
);

app.use(
    helmet.hsts({ maxAge: 31536000, includeSubDomains: true }) // Força HTTPS por 1 ano
);

// Opcional: remove cabeçalho que identifica o servidor
app.use(helmet.hidePoweredBy());

// Configuração da sessão, teria q ser mudado por questões de segurança quando for rodar o app fora do local
app.use(session({
    secret: 'ecocity2025',
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: false, // true somente em HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax' // ✅ recomendado para evitar perda de sessão em navegadores
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

app.get('/api/teste-sessao', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ logado: true, user: req.session.user });
    } else {
        res.json({ logado: false });
    }
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
