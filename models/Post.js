// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a configuração do banco de dados
const sequelize = require('../config/database');
// Importa o modelo de Usuário para estabelecer relacionamentos
const User = require('./User');

// Define o modelo de Post com seus campos e relacionamentos
const Post = sequelize.define('Post', {
    // Identificador único da postagem
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Título da postagem
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Descrição detalhada da postagem
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // URL da imagem associada à postagem
    imagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Data de criação da postagem
    data: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define o relacionamento entre Post e User
// Uma postagem pertence a um usuário (autor)
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'autor'
});

// Um usuário pode ter várias postagens
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'posts'
});

// Exporta o modelo de Post para ser utilizado em outros módulos
module.exports = Post;