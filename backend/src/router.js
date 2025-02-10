const express = require('express');
const tasksController = require('./models/tasksController');
const router = express.Router();

/** ROTAS PARA CLIENTES */
router.post('/clientes', tasksController.cadastrarCliente); // post = criar algo
router.get('/clientes/:cpf', tasksController.buscarClienteCpf); // get = pegar algo
router.put('/clientes/:cpf', tasksController.atualizarCliente); //put = atualizar algo
router.get('/clientes/status/:id', tasksController.statusCliente);
router.get('/clientes', tasksController.listarClientes);
router.get('/clientes/verificar/:cpf', tasksController.verificarClienteExistente);
router.patch('/clientes/atualizar', tasksController.atualizarCampoCliente); // patch = atualizar um campo especifico
router.get('/clientes/nome/:nome', tasksController.buscarClienteNome);
router.get('/clientes/contar', tasksController.contarClientes);

// Rotas para Pets
router.post('/pets', tasksController.cadastrarPet);
router.get('/pets/:id', tasksController.listarPetId);
router.get('/pets/prop/:cpf', tasksController.listarPetCpfProp);
router.put('/pets/:id', tasksController.atualizarPet);
router.patch('/pets/atualizar', tasksController.atualizarCampoPet);
router.get('/pets/status/:id', tasksController.statusPet);
router.get('/pets', tasksController.listarPet);

// Rotas para Vacinas
router.post('/vacinas', tasksController.cadastrarVacina);
router.get('/vacinas/:id', tasksController.buscarVacinaId);
router.get('/vacinas/pet/:id_pet', tasksController.listarVacinasPet);
router.put('/vacinas/:id', tasksController.atualizarVacina);
router.get('/vacinas', tasksController.listarVacinas);

// Rotas para Procedimentos
router.post('/procedimentos', tasksController.cadastrarProcedimento);
router.get('/procedimentos/:id', tasksController.buscarProcedimentoId);
router.get('/procedimentos', tasksController.listarProcedimentos);
router.get('/procedimentos/pet/:id_pet', tasksController.listarProcedimentosPet);
router.put('/procedimentos/:id', tasksController.atualizarProcedimento);

// Rotas para Medicamentos
router.post('/medicamentos', tasksController.cadastrarMedicamento);
router.get('/medicamentos/:id', tasksController.buscarMedicamentoId);
router.get('/medicamentos/pet/:id_pet', tasksController.listarMedicamentosPet);
router.put('/medicamentos/:id', tasksController.atualizarMedicamento);
router.get('/medicamentos', tasksController.listarMedicamentos);

module.exports = router;