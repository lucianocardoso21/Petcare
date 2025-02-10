const express = require('express');
const tasksController = require('./models/tasksController');
const router = express.Router();

/** ROTAS PARA CLIENTES */
router.post('/clientes', tasksController.cadastrarCliente); // post = criar algo
router.get('/clientes', tasksController.listarClientes);
router.get('/clientes/contar', tasksController.contarClientes);
router.patch('/clientes/atualizar', tasksController.atualizarCampoCliente); // patch = atualizar um campo especifico
router.get('/clientes/:cpf', tasksController.buscarClienteCpf); // get = pegar algo
router.put('/clientes/:cpf', tasksController.atualizarCliente); //put = atualizar algo
router.get('/clientes/status/:cpf', tasksController.statusCliente);
router.get('/clientes/verificar/:cpf', tasksController.verificarClienteExistente);
router.get('/clientes/nome/:nome', tasksController.buscarClienteNome);
router.patch('/clientes/status/:cpf', tasksController.alterarStatusCliente);

// Rotas para Pets
router.post('/pets', tasksController.cadastrarPet);
router.get('/pets', tasksController.listarPet);
router.patch('/pets/atualizar', tasksController.atualizarCampoPet);
router.get('/pets/:id', tasksController.listarPetId);
router.put('/pets/:id', tasksController.atualizarPet);
router.get('/pets/prop/:cpf', tasksController.listarPetCpfProp);
router.get('/pets/status/:id', tasksController.statusPet);
router.patch('/pets/status/:id', tasksController.alterarStatusPet);

// Rotas para Vacinas
router.post('/vacinas', tasksController.cadastrarVacina);
router.get('/vacinas', tasksController.listarVacinas);
router.get('/vacinas/:id', tasksController.buscarVacinaId);
router.put('/vacinas/:id', tasksController.atualizarVacina);
router.get('/vacinas/pet/:id_pet', tasksController.listarVacinasPet);

// Rotas para Procedimentos
router.post('/procedimentos', tasksController.cadastrarProcedimento);
router.get('/procedimentos', tasksController.listarProcedimentos);
router.get('/procedimentos/:id', tasksController.buscarProcedimentoId);
router.put('/procedimentos/:id', tasksController.atualizarProcedimento);
router.get('/procedimentos/pet/:id_pet', tasksController.listarProcedimentosPet);

// Rotas para Medicamentos
router.post('/medicamentos', tasksController.cadastrarMedicamento);
router.get('/medicamentos', tasksController.listarMedicamentos);
router.get('/medicamentos/:id', tasksController.buscarMedicamentoId);
router.put('/medicamentos/:id', tasksController.atualizarMedicamento);
router.get('/medicamentos/pet/:id_pet', tasksController.listarMedicamentosPet);

module.exports = router;