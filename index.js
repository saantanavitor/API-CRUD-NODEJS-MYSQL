// Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const Cliente = require("./database/cliente");
const Endereco = require("./database/endereco");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON

// Configuração do banco de dados
const { connection, authenticate } = require("./database/database")
authenticate(connection);  //efetivar a conexão


// Definição de rotas
app.post("/clientes", async (req, res) => {
    const {nome, email, telefone} = req.body;
    
    try {
      const novo = await Cliente.create({nome, email, telefone});
      res.status(201).json(novo);
    }
    catch (err) {
        res.status(500).json({message: "Um erro aconteceu"});
    }
})

// Escuta de eventos (listen)
app.listen(3000, () => {
    connection.sync({force: true});  // Force apaga tudo e recria as tabelas
    console.log("Servidor rodando em http://localhost:3000")
});