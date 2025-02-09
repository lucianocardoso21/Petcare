const tasksModels = require('./tasksModels');

const cadastrarCliente = async (req,res) => {
    const tasks = await tasksModels.cadastrarCliente();
    return(
        res.status(200).json(tasks)
    );
};
const buscarClienteCpf = async (req,res) => {
    const tasks = await tasksModels.buscarClienteCpf();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarCliente = async (req,res) => {
    const tasks = await tasksModels.atualizarCliente();
    return(
        res.status(200).json(tasks)
    );
};
const statusCliente = async (req,res) => {
    const tasks = await tasksModels.statusCliente();
    return(
        res.status(200).json(tasks)
    );
};
const listarClientes = async (req,res) => {
    const tasks = await tasksModels.listarClientes();
    return(
        res.status(200).json(tasks)
    );
};
const verificarClienteExistente = async (req,res) => {
    const tasks = await tasksModels.verificarClienteExistente();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarCampoCliente = async (req,res) => {
    const tasks = await tasksModels.atualizarCampoCliente();
    return(
        res.status(200).json(tasks)
    );
};
const buscarClienteNome = async (req,res) => {
    const tasks = await tasksModels.buscarClienteNome();
    return(
        res.status(200).json(tasks)
    );
};
const contarClientes = async (req,res) => {
    const tasks = await tasksModels.contarClientes();
    return(
        res.status(200).json(tasks)
    );
};
const cadastrarPet = async (req,res) => {
    const tasks = await tasksModels.cadastrarPet();
    return(
        res.status(200).json(tasks)
    );
};
const listarPetId = async (req,res) => {
    const tasks = await tasksModels.listarPetId();
    return(
        res.status(200).json(tasks)
    );
};
const listarPetCpfProp = async (req,res) => {
    const tasks = await tasksModels.listarPetCpfProp();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarPet = async (req,res) => {
    const tasks = await tasksModels.atualizarPet();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarCampoPet = async (req,res) => {
    const tasks = await tasksModels.atualizarCampoPet();
    return(
        res.status(200).json(tasks)
    );
};
const statusPet = async (req,res) => {
    const tasks = await tasksModels.statusPet();
    return(
        res.status(200).json(tasks)
    );
};
const listarPet = async (req,res) => {
    const tasks = await tasksModels.listarPet();
    return(
        res.status(200).json(tasks)
    );
};
const cadastrarVacina = async (req,res) => {
    const tasks = await tasksModels.cadastrarVacina();
    return(
        res.status(200).json(tasks)
    );
};
const buscarVacinaId = async (req,res) => {
    const tasks = await tasksModels.buscarVacinaId();
    return(
        res.status(200).json(tasks)
    );
};
const listarVacinasPet = async (req,res) => {
    const tasks = await tasksModels.listarVacinasPet();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarVacina = async (req,res) => {
    const tasks = await tasksModels.atualizarVacina();
    return(
        res.status(200).json(tasks)
    );
};
const listarVacinas = async (req,res) => {
    const tasks = await tasksModels.listarVacinas();
    return(
        res.status(200).json(tasks)
    );
};
const cadastrarProcedimento = async (req,res) => {
    const tasks = await tasksModels.cadastrarProcedimento();
    return(
        res.status(200).json(tasks)
    );
};
const buscarProcedimentoId = async (req,res) => {
    const tasks = await tasksModels.buscarProcedimentoId();
    return(
        res.status(200).json(tasks)
    );
};
const listarProcedimentos = async (req,res) => {
    const tasks = await tasksModels.listarProcedimentos();
    return(
        res.status(200).json(tasks)
    );
};
const listarProcedimentosPet = async (req,res) => {
    const tasks = await tasksModels.listarProcedimentosPet();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarProcedimento = async (req,res) => {
    const tasks = await tasksModels.atualizarProcedimento();
    return(
        res.status(200).json(tasks)
    );
};
const cadastrarMedicamento = async (req,res) => {
    const tasks = await tasksModels.cadastrarMedicamento();
    return(
        res.status(200).json(tasks)
    );
};
const buscarMedicamentoId = async (req,res) => {
    const tasks = await tasksModels.buscarMedicamentoId();
    return(
        res.status(200).json(tasks)
    );
};
const listarMedicamentosPet = async (req,res) => {
    const tasks = await tasksModels.listarMedicamentosPet();
    return(
        res.status(200).json(tasks)
    );
};
const atualizarMedicamento = async (req,res) => {
    const tasks = await tasksModels.atualizarMedicamento();
    return(
        res.status(200).json(tasks)
    );
};
const listarMedicamentos = async (req,res) => {
    const tasks = await tasksModels.listarMedicamentos();
    return(
        res.status(200).json(tasks)
    );
};

module.exports = {
    cadastrarCliente,
    buscarClienteCpf,
    atualizarCliente,
    statusCliente,
    listarClientes,
    verificarClienteExistente,
    atualizarCampoCliente,
    buscarClienteNome,
    contarClientes,
    cadastrarPet,
    listarPetId,
    listarPetCpfProp,
    atualizarPet,
    atualizarCampoPet,
    statusPet,
    listarPet,
    cadastrarVacina,
    buscarVacinaId,
    listarVacinasPet,
    atualizarVacina,
    listarVacinas,
    cadastrarProcedimento,
    buscarProcedimentoId,
    listarProcedimentos,
    listarProcedimentosPet,
    atualizarProcedimento,
    cadastrarMedicamento,
    buscarMedicamentoId,
    listarMedicamentosPet,
    atualizarMedicamento,
    listarMedicamentos,
};