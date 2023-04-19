const Cliente = require("../database/cliente");
const Pet = require("../database/pet");

const { Router } = require("express");

// Criar o grupo de rotas (/pets)
const router = Router();

router.post("/pets/", async (req, res) => {  // Adicionar novo pet
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

router.get("/pets/", async (req, res) => {   // Lista de pets
    const listaPets = await Pet.findAll();
    res.json(listaPets);
});

router.get("/pets/:id", async (req, res) => {   // Buscar pet por ID
    const {id} = req.params;

    const pet = await Pet.findByPk(id);

    if (pet){
        res.status(200).json(pet);
    }
    else {
        res.status(404).json({message: "Pet não encontrados"});
    }

});

router.put("/pets/:id", async (req, res) => {   // Atualizar pet por ID
    //dados que virão no corpo do json
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

router.delete("/pets/:id", async (req,res) => { // Deletar pet por ID
        // checar se o pet existe antes de apagar
        const pet = await Pet.findByPk(req.params.id);
    
        if(pet) {       // se existe, pode apagar
            await pet.destroy();
            res.json({message: "Pet removido."})
        } else {
            res.status(404).json({message: "Pet nao encontrado."})
        }
    });

module.exports = router;