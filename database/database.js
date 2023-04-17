// arquivo de conexão com o banco de dados

const {Sequelize} = require('sequelize');

// Criando objeto de conexão
const connection = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '-03:00'
    }
    );

    // Estabelecer conexão usando o objeto
    async function authenticate(connection) {
       try {
        await connection.authenticate(); // Tentar estabelecer conexão
        console.log('Authenticated');
       }
       catch (err) {
            console.log("Um erro inesperado aconteceu", err);
       }
    }

    module.exports = {connection, authenticate};