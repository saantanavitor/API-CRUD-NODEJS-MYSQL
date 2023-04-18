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
    const { id } = req.params;
    try {
        const cliente = await Cliente.findOne({where: {id: id}});
        if ( cliente) {
            await Cliente.findByPk(req.params.id)
            Cliente.update({
            nome: req.body.nome,
            email: req.body.email,},
            {where: {id: req.params.id,}})
            res.status(200).send({message: "Update feito com sucesso."})
            }
            else {
                res.status(404).json({message: "Usuário não encontrado"})
            }
    } catch (err) {
        res.status(500).json({message: "Algum erro aconteceu"})
    }
});

app.delete("/clientes/:id", async (req, res) => {   // Deletar cliente por ID
    const {id} = req.params;
    const cliente = await Cliente.findOne({where: {id}});
    try {
        if (cliente) {
            await cliente.destroy();
            res.status(200).send({message: "Cliente removido."});
        }
        else {
            res.status(404).send({message: "Cliente não encontrado."});
        }
      } catch (error) {
        res.status(500).send({message: "Um erro aconteceu."});
      }
    });

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000")
});