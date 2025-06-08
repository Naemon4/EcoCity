// Importa os modelos necessários para o controlador
const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');

// Controlador responsável por gerenciar todas as operações relacionadas às postagens
class PostController {
    // Método para criar uma nova postagem
    // Recebe título, descrição e imagem, vincula ao usuário atual
    static async createPost(req, res) {
        try {
            const { titulo, descricao } = req.body;
            const imagemFile = req.files.imagem;
            const fileName = `post_${Date.now()}${path.extname(imagemFile.name)}`;
            const uploadPath = path.join(process.cwd(), 'public', 'img', 'uploads', fileName);

            await imagemFile.mv(uploadPath);

            const post = await Post.create({
                titulo,
                descricao,
                imagem: `/img/uploads/${fileName}`,
                userId: req.session.user.id
            });

            const postWithUser = await Post.findByPk(post.id, {
                include: [{
                    model: User,
                    as: 'autor',
                    attributes: ['nome', 'profileImage']
                }]
            });

            return res.status(201).json({
                success: true,
                message: 'Post criado com sucesso!',
                post: {
                    id: postWithUser.id,
                    titulo: postWithUser.titulo,
                    descricao: postWithUser.descricao,
                    imagem: postWithUser.imagem,
                    data: postWithUser.data,
                    userId: postWithUser.userId,
                    autorNome: postWithUser.autor.nome,
                    autorImagem: postWithUser.autor.profileImage
                }
            });
        } catch (error) {
            console.error('Erro ao criar post:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao processar o post.'
            });
        }
    }

    // Método para buscar todas as postagens do sistema
    // Retorna lista de posts ordenada por data, incluindo informações do autor
    static async getAllPosts(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{
                    model: User,
                    as: 'autor',
                    attributes: ['nome', 'profileImage']
                }],
                order: [['data', 'DESC']]
            });

            const formattedPosts = posts.map(post => ({
                id: post.id,
                titulo: post.titulo,
                descricao: post.descricao,
                imagem: post.imagem,
                data: post.data,
                userId: post.userId,
                autorNome: post.autor.nome,
                autorImagem: post.autor.profileImage
            }));

            res.json({ success: true, posts: formattedPosts });
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar posts.' });
        }
    }

    // Método para buscar todas as postagens de um usuário específico
    // Filtra posts pelo ID do usuário autenticado
    static async getUserPosts(req, res) {
        try {
            const posts = await Post.findAll({
                where: { userId: req.user.id },
                include: [{
                    model: User,
                    as: 'autor',
                    attributes: ['nome', 'profileImage']
                }],
                order: [['data', 'DESC']]
            });

            res.json({
                success: true,
                posts: posts.map(post => ({
                    id: post.id,
                    titulo: post.titulo,
                    descricao: post.descricao,
                    imagem: post.imagem,
                    data: post.data,
                    userId: post.userId,
                    autorNome: post.autor.nome,
                    autorImagem: post.autor.profileImage
                }))
            });
        } catch (error) {
            console.error('Erro ao buscar posts do usuário:', error);
            res.status(500).json({ success: false, message: 'Erro ao buscar posts.' });
        }
    }
}

module.exports = PostController;