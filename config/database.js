// Importa o Sequelize, um ORM (Object-Relational Mapping) para Node.js
const { Sequelize } = require('sequelize');

// Configura a conexão com o banco de dados MySQL
// - database: 'ecocity'
// - username: 'root'
// - password: ''
// - configurações adicionais: host, dialect e logging
const sequelize = new Sequelize('ecocity', 'root', '', {
    host: 'localhost',      // Endereço do servidor MySQL
    dialect: 'mysql',       // Tipo de banco de dados utilizado
    dialectModule: require('mysql2'),  // Driver MySQL para Node.js
    logging: false          // Desativa logs de SQL no console
});

// Testa a conexão com o banco de dados
// Tenta autenticar e estabelecer a conexão
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados:', err);
    });

// Exporta a instância do Sequelize para ser utilizada em outros módulos
module.exports = sequelize;