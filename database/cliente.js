const { DataTypes } = require ("sequelize"); // DataTypes = serve para definir qual o tipo da coluna
const { connection } = require ("./database");
const Endereco = require ("./endereco");

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

// Cliente tem um endereço
// Endereço ganha uma chave estrangeira (nome do model + id)
// Chave estrangeira = clienteId
// Associação 1:1 (One-to-One)
Cliente.hasOne(Endereco); // Cliente tem um endereço
Endereco.belongsTo(Cliente); // Endereço pertence a um cliente

module.exports = Cliente;