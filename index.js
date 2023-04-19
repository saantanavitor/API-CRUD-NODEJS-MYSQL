// Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON
app.use(morgan("dev")); // Puxando logs com o morgan

// Configuração do banco de dados
const { connection, authenticate } = require("./database/database")
authenticate(connection);  //efetivar a conexão


// Definição de rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

app.use(rotasClientes); // Configurar grupo de rotas no app
app.use(rotasPets); 

app.listen(3000, () => {
    // connection.sync({force: true}); - Deleta e cria um novo banco de dados
    console.log("Servidor rodando em http://localhost:3000")
});