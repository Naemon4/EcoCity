const { escreveNoJson } = require('./processaDados.js');
const express = require('express');
const session = require('express-session'); // usando ele para mantes a sessão de um user ativa
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'ecocity2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using https
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
}));

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados enviados via formulário (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para processar JSON
app.use(express.json());

// Rotas para as paginas
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/meusPosts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'suasPostagens.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'perfil.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/editarPerfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'editarPerfil.html'));
});

app.get('/criarPost', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'criarPostagens.html'));
});

// Adicionar no início do arquivo, após as configurações iniciais
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Verifica se o diretório data existe, se não, cria
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Verifica se o arquivo users.json existe, se não, cria com array vazio
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '[]', 'utf8');
}

app.get('/api/posts', (req, res) => {
    const tarefasFilePath = path.join(__dirname, 'data', 'posts.json');

    fs.readFile(tarefasFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de posts:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar os posts.' });
        }

        let tarefas = [];
        try {
            if (data) {
                tarefas = JSON.parse(data);
            }
        } catch (parseError) {
            console.error('Erro ao fazer o parsing do arquivo de posts:', parseError);
            return res.status(500).json({ success: false, message: 'Erro ao processar os posts.' });
        }

        return res.status(200).json({ success: true, tarefas });
    });
});

function validateData(data) {
    const {
        nome, email, senha, confirmarSenha, telefone,
        bairro, rua, numero, cpf,
    } = data;

    // Verificações de campos obrigatórios
    if (!nome || !bairro || !rua || !numero) {
        const error = new Error('Todos os campos são obrigatórios.');
        error.statusCode = 400;
        throw error;
    }

    // Verificação de email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = new Error('Email inválido.');
        error.statusCode = 400;
        throw error;
    }

    // Verificação de senhas iguais
    if (senha !== confirmarSenha || !senha || !confirmarSenha) {
        const error = new Error('As senhas não coincidem.');
        error.statusCode = 400;
        throw error;
    }

    // Verificação de CPF (formato básico)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        const error = new Error('CPF inválido.');
        error.statusCode = 400;
        throw error;
    }

    // Verificação de telefone (formato básico)
    const telefoneLimpo = telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        const error = new Error('Telefone inválido.');
        error.statusCode = 400;
        throw error;
    }

    return { cpfLimpo, telefoneLimpo };
}

// Rota POST para cadastrar um novo user e salva-lo no JSON
app.post('/users', (req, res) => {
    try {
        const { cpfLimpo, telefoneLimpo } = validateData(req.body);
        const { nome, email, senha, bairro, rua, numero } = req.body;
        const filePath = path.join(__dirname, 'data', 'users.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo JSON:', err);
                return res.status(500).json({ success: false, message: 'Erro ao processar o cadastro.' });
            }

            const users = JSON.parse(data);
            const novoUser = {
                id: Math.floor(Math.random() * 900000000000) + 100000000000,
                nome,
                email,
                senha,
                telefone: telefoneLimpo,
                endereco: {
                    bairro,
                    rua,
                    numero,
                },
                cpf: cpfLimpo,
                posts: [],
                profileImage: '/img/EcoCity.png'
            };

            users.push(novoUser);
            const response = escreveNoJson(users, filePath);
            return res.status(200).json(response);
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erro interno do servidor',
        });
    }
});

// Rota POST para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    const filePath = path.join(__dirname, 'data', 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar o login.' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email && u.senha === senha);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Email ou senha incorretos.' });
        }

        // Salvar dados do usuário na sessão
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            userId: user.id
        });
    });
});

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    // Verifica tanto a sessão quanto o header
    const userId = req.session.userId || req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
    }

    const filePath = path.join(__dirname, 'data', 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao verificar autenticação' });
        }

        const users = JSON.parse(data);
        const user = users.find((u) => u.id === parseInt(userId));

        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
        }

        req.user = user;
        next();
    });
};

// Rota POST para cadastrar um novo post
app.post('/posts', authMiddleware, async (req, res) => {
    const { titulo, descricao, imagem } = req.body;

    if (!titulo || !descricao || !imagem) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios.'
        });
    }

    try {
        const data = await fs.promises.readFile(path.join(__dirname, 'data', 'users.json'), 'utf8');
        const users = JSON.parse(data);
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        const novoPost = {
            id: users[userIndex].posts.length + 1,
            titulo,
            descricao,
            imagem,
            data: new Date().toISOString(),
            userId: req.user.id,
            autorNome: req.user.nome,
            autorImagem: req.user.profileImage
        };

        users[userIndex].posts.push(novoPost);
        await fs.promises.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));

        return res.status(200).json({
            success: true,
            message: 'Post criado com sucesso!',
            post: novoPost
        });
    } catch (error) {
        console.error('Erro ao processar post:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar o post.'
        });
    }
});

// Rota para buscar todos os posts
app.get('/api/all-posts', (req, res) => {
    const usersFilePath = path.join(__dirname, 'data', 'users.json');

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo de usuários:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar posts.' });
        }

        const users = JSON.parse(data);
        // Coleta todos os posts de todos os usuários
        const allPosts = users.reduce((posts, user) => posts.concat(user.posts.map((post) => ({
            ...post,
            autorNome: user.nome,
            autorImagem: user.profileImage, // Adicionando a imagem do autor
        }))), []);

        // Ordena os posts por data, do mais recente para o mais antigo
        allPosts.sort((a, b) => new Date(b.data) - new Date(a.data));

        res.json({ success: true, posts: allPosts });
    });
});

// Rota para buscar os dados do usuário que está logado atualmente
app.get('/api/user-data', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: {
            nome: req.user.nome,
            email: req.user.email,
            telefone: req.user.telefone,
            endereco: req.user.endereco,
            posts: req.user.posts,
            profileImage: req.user.profileImage, // Adicionando a imagem de perfil
        },
    });
});

// Rota para buscar apenas os posts do usuário logado
app.get('/api/user-posts', authMiddleware, (req, res) => {
    // Retorna array de posts do usuário
    res.json({
        success: true,
        posts: req.user.posts,
    });
});

// Rota para atualizar a imagem de perfil do usuário
app.post('/api/update-profile-image', authMiddleware, (req, res) => {
    // Extrai a imagem do corpo da requisição
    const { profileImage } = req.body;
    // Define o caminho do arquivo de usuários
    const usersFilePath = path.join(__dirname, 'data', 'users.json');

    // Lê o arquivo de usuários
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo de usuários:', err);
            return res.json({ success: false, message: 'Erro ao atualizar imagem' });
        }

        // Converte o JSON para objeto JavaScript
        const users = JSON.parse(data);
        // Encontra o índice do usuário atual
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        // Verifica se o usuário foi encontrado
        if (userIndex === -1) {
            return res.json({ success: false, message: 'Usuário não encontrado' });
        }

        // Atualiza a imagem de perfil do usuário
        users[userIndex].profileImage = profileImage;

        // Salva as alterações no arquivo
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar imagem:', err);
                return res.json({ success: false, message: 'Erro ao salvar imagem' });
            }
            res.json({ success: true, message: 'Imagem atualizada com sucesso' });
        });
    });
});

// Rota para atualizar os dados do perfil do usuário
app.post('/api/update-user-data', authMiddleware, (req, res) => {
    // Extrai os dados atualizados do corpo da requisição
    const userData = req.body;
    // Define o caminho do arquivo de usuários
    const usersFilePath = path.join(__dirname, 'data', 'users.json');

    // Lê o arquivo de usuários
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo de usuários:', err);
            return res.json({ success: false, message: 'Erro ao atualizar dados' });
        }

        // Converte o JSON para objeto JavaScript
        const users = JSON.parse(data);
        // Encontra o índice do usuário atual
        const userIndex = users.findIndex((u) => u.id === req.user.id);

        // Verifica se o usuário foi encontrado
        if (userIndex === -1) {
            return res.json({ success: false, message: 'Usuário não encontrado' });
        }

        // Atualiza os dados do usuário
        users[userIndex].nome = userData.nome;
        users[userIndex].email = userData.email;
        users[userIndex].telefone = userData.telefone;
        users[userIndex].endereco = userData.endereco;

        // Salva as alterações no arquivo
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Erro ao salvar dados:', err);
                return res.json({ success: false, message: 'Erro ao salvar dados' });
            }
            res.json({ success: true, message: 'Dados atualizados com sucesso' });
        });
    });
});

// Rota POST para logout
app.post('/logout', (req, res) => {
    // Destrói a sessão do usuário
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).json({ success: false, message: 'Erro ao fazer logout' });
        }

        // Retorna sucesso se a sessão foi destruída
        res.json({ success: true, message: 'Logout realizado com sucesso' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
