const { DataTypes } = require ("sequelize"); // DataTypes = serve para definir qual o tipo da coluna
const { connection } = require ("./database");
const Cliente = require ("./cliente");

const Pet = connection.define("pet", {
    nome: {  
        type: DataTypes.STRING(130), 
        allowNull: false, 
    },
    tipo: { 
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    porte: { 
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    dataNasc: { 
        type: DataTypes.DATEONLY,
    },
});

// Relacionamento 1:N (Um cliente pode ter N pets)
Cliente.hasMany(Pet, {onDelete: "CASCADE"});
Pet.belongsTo(Cliente);


module.exports = Pet;