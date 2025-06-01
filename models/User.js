// Importa os tipos de dados do Sequelize
const { DataTypes } = require('sequelize');
// Importa a configuração do banco de dados
const sequelize = require('../config/database');

// Define o modelo de Usuário com seus campos e validações
const User = sequelize.define('User', {
    // Identificador único do usuário
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nome completo do usuário
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Email do usuário (único e validado)
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // Senha do usuário (armazenada com hash)
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Número de telefone para contato
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Bairro do endereço do usuário
    bairro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Nome da rua do endereço
    rua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Número do endereço
    numero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // CPF do usuário (único)
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // URL da imagem de perfil do usuário
    profileImage: {
        type: DataTypes.STRING,
        defaultValue: '/img/EcoCity.png'
    }
});

// Exporta o modelo de Usuário para ser utilizado em outros módulos
module.exports = User;