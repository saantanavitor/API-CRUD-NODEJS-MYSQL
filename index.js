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
    const {nome, email, telefone, endereco} = req.body;

    try {
      const novo = await Cliente.create({nome, email, telefone, endereco}, {include: [Endereco]});
      res.status(201).json(novo);
    }
    catch (err) {
        res.status(500).json({message: "Um erro aconteceu"});
    }
})

app.delete("/clientes", async (req, res) => {
    const {id} = req.body;

    try {
        const deleteUser = await  Cliente.destroy({where: {id:id}}) && Endereco.destroy({where: {id:id}});
        res.status(204).json(deleteUser);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

app.listen(3000, () => {
     connection.sync({force: true}) // Force apaga tudo e recria as tabelas
    console.log("Servidor rodando em http://localhost:3000")
});