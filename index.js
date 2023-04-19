// Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const Cliente = require("./database/cliente");
const Endereco = require("./database/endereco");
const Pet = require ("./database/pet");

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

app.put("/clientes/:id", async (req, res) => {        // Fazer update nos dados do cliente
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

app.post("/pets/", async (req, res) => {  // Adicionar novo pet
    const {nome, tipo, dataNasc, porte, clienteId} = req.body;

    try {
        const cliente = Cliente.findByPk(clienteId);
        if (cliente) {
        const pet = await Pet.create({nome, tipo, dataNasc, porte, clienteId})
        res.status(201).json(pet);
        } else {
            res.status(404).json({message:"Cliente não encontrado."});
        }
    }
    catch (err) {
        res.status(500).json({message: "Um erro aconteceu"});
    }
});

app.get("/pets/", async (req, res) => {   // Lista de pets
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

app.get("/pets/:id", async (req, res) => {   // Buscar pet por ID
    const {id} = req.params;

    const pet = await Pet.findByPk(id);

    if (pet){
        res.status(200).json(pet);
    }
    else {
        res.status(404).json({message: "Pet não encontrados"});
    }

});

app.put("/pets/:id", async (req, res) => {   // Atualizar pet por ID
    //dados que virao no corpo do json
    const { nome, raca, porte, dtNasc } = req.body;
    //checar a existencia do pet no sistema (select * from pets where id= req.params.id)
    const pet = await Pet.findByPk(req.params.id);

    try {
        if(pet) {
            //atualiza
            //IMPORTANTE indicar qual pet atualizar!! COLOCAR A CONDIÇÃO where
            // 1º argumento: dados novos, 2º argumento: where(condicao de busca: id)
            await Pet.update({nome, raca, porte, dtNasc}, {where: {id: req.params.id}});
            res.json({message: "Pet atualizado."});
        } else {
            //retorna 404, caso id invalido
            res.status(404).json({message: "Pet não encontrado."})
        }
    } catch(err) {
        //retorna 500, caso erro inesperado
        console.log(err);
        res.status(500).json({message: "Um erro aconteceu ao tentar conectar com o servidor."})
    }
});

app.delete("/pets/:id", async (req,res) => { // Deletar pet por ID
        // checar se o pet existe antes de apagar
        const pet = await Pet.findByPk(req.params.id);
    
        if(pet) {       // se existe, pode apagar
            await pet.destroy();
            res.json({message: "Pet removido."})
        } else {
            res.status(404).json({message: "Pet nao encontrado."})
        }
    });

app.listen(3000, () => {
    connection.sync({force: true});
    console.log("Servidor rodando em http://localhost:3000")
});