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
app.post("/clientes", async (req, res) => {  // Adicionar novo cliente
    const {nome, email, telefone, endereco} = req.body;

    try {
      const novo = await Cliente.create({nome, email, telefone, endereco}, {include: [Endereco]});
      res.status(201).json(novo);
    }
    catch (err) {
        res.status(500).json({message: "Um erro aconteceu"});
    }
})

app.get("/clientes", async (req, res) => {    // Lista de clientes
    try {
        const listaDeClientes = await Cliente.findAll();
        res.status(200).json(listaDeClientes);
    } catch (err) {
        res.status(500).json({message:"Erro aconteceu"});
    }
});

app.get("/clientes/:id", async (req, res) => {        // Buscar usuário por ID
    try {
        const ClientePorId = await Cliente.findOne({where: {id: req.params.id}});
        res.json(ClientePorId)
    }    
        catch (err)  {
            res.status(404).json({message: "Usuário não encontrado."})
        }
});

app.put("/clientes/:id", async (req, res) => {
    try {
        Cliente.findByPk(req.params.id)
        Cliente.update({
            nome: req.body.nome,
            email: req.body.email,},
            {where: {id: req.params.id,}})
    
    res.status(200).send({message: "Adicionado com sucesso."})
    } catch (err) {
        res.status(404).json({err})
    }
});

app.delete("/clientes", async (req, res) => {   // Deletar cliente por ID
    const {id} = req.body;

    try {
        const deleteUser = await  Cliente.destroy({where: {id:id}}) && Endereco.destroy({where: {id:id}});
        res.status(204).json(deleteUser);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

app.listen(3000, () => {
      // Force apaga tudo e recria as tabelas
    console.log("Servidor rodando em http://localhost:3000")
});