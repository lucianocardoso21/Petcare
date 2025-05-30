const express = require('express');
const tasksController = require('./models/tasksController');
const verificarToken = require('./models/verificarToken');
const router = express.Router();

/** ROTAS PARA CLIENTES */
router.post('/clientes', tasksController.cadastrarCliente); // post = criar algo
router.get('/cadastro', tasksController.telaDeCadastro);
router.get('/clientes', tasksController.listarClientes);
router.get('/clientes/contar', tasksController.contarClientes);
router.patch('/clientes/atualizar/:cpf', tasksController.atualizarCampoCliente); // patch = atualizar um campo especifico
router.patch('/clientes/status/:cpf', tasksController.alterarStatusCliente);
router.get('/clientes/:cpf', tasksController.buscarClienteCpf); // get = pegar algo
router.get('/clientes/status/:cpf', tasksController.statusCliente);
router.get('/clientes/verificar/:cpf', tasksController.verificarClienteExistente);
router.get('/clientes/nome/:nome', tasksController.buscarClienteNome);

// Rotas para Pets
router.post('/pets', tasksController.cadastrarPet);
router.get('/pets', tasksController.listarPet);
router.patch('/pets/atualizar/:id', tasksController.atualizarCampoPet);
router.patch('/pets/status/:id', tasksController.alterarStatusPet);
router.get('/pets/:id', tasksController.listarPetId);
router.get('/pets/prop/:cpf', tasksController.listarPetCpfProp);
router.get('/pets/status/:id', tasksController.statusPet);

// Rotas para Vacinas
router.post('/vacinas', tasksController.cadastrarVacina);
router.get('/vacinas/:id', tasksController.buscarVacinaId);
router.patch('/vacinas/:id', tasksController.atualizarVacina);
router.get('/vacinas/pet/:id_pet', tasksController.listarVacinasPet);
router.delete('/vacinas/:id', tasksController.removerVacina);

// Rotas para Procedimentos
router.post('/procedimentos', tasksController.cadastrarProcedimento);
router.get('/procedimentos/:id', tasksController.buscarProcedimentoId);
router.patch('/procedimentos/:id', tasksController.atualizarProcedimento);
router.get('/procedimentos/pet/:id_pet', tasksController.listarProcedimentosPet);
router.delete('/procedimentos/:id', tasksController.removerProcedimento);

// Rotas para Medicamentos
router.post('/medicamentos', tasksController.cadastrarMedicamento);
router.get('/medicamentos/:id', tasksController.buscarMedicamentoId);
router.delete('/medicamentos/:id', tasksController.excluirMedicamentoId);
router.patch('/medicamentos/:id', tasksController.atualizarMedicamento);
router.get('/medicamentos/pet/:id_pet', tasksController.listarMedicamentosPet);

// Rota de login Verificação e Cadastro
router.post('/login', tasksController.loginCliente);
router.get('/dashboard', verificarToken, tasksController.dashboard);
router.get('/auth', verificarToken, tasksController.authCliente);

module.exports = router;