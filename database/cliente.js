const { DataTypes } = require ("sequelize"); // DataTypes = serve para definir qual o tipo da coluna
const { connection } = require ("./database");

const Cliente = connection.define("cliente", {
    nome: {  
        type: DataTypes.STRING(130), 
        allowNull: false, 
    },
    email: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefone: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Cliente;