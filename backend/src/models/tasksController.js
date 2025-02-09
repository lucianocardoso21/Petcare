const tasksModels = require('./tasksModels');

const responderComErro = (res, erro) => {
    return res.status(500).json({ error: erro.message || erro });
};

const responderComSucesso = (res, data) => {
    return res.status(200).json(data);
};

const cadastrarCliente = async (req,res) => {
    try {const tasks = await tasksModels.cadastrarCliente(req.body);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const buscarClienteCpf = async (req, res) => {
    try {
        const { cpf } = req.params; // Obtendo CPF via parâmetros de URL
        if (!cpf) throw new Error('CPF é necessário');
        const tasks = await tasksModels.buscarClienteCpf(cpf);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};

const atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params; // Obtendo ID do cliente via URL
        const { nome, celular } = req.body; // Dados para atualização
        if (!id || !nome || !celular) throw new Error('Faltando dados necessários');
        const tasks = await tasksModels.atualizarCliente(id, nome, celular);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};

const statusCliente = async (req, res) => {
    try {
        const { id } = req.params; // Obtendo ID do cliente
        if (!id) throw new Error('ID do cliente é necessário');
        const tasks = await tasksModels.statusCliente(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarClientes = async (req, res) => {
    try {
        const tasks = await tasksModels.listarClientes();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const verificarClienteExistente = async (req, res) => {
    try {
        const { cpf } = req.params; // Obtendo CPF
        if (!cpf) throw new Error('CPF é necessário');
        const tasks = await tasksModels.verificarClienteExistente(cpf);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarCampoCliente = async (req, res) => {
    try {
        const { id, campo, valor } = req.body; // Campos a serem atualizados
        if (!id || !campo || !valor) throw new Error('Faltando dados para atualização');
        const tasks = await tasksModels.atualizarCampoCliente(id, campo, valor);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const buscarClienteNome = async (req, res) => {
    try {
        const { nome } = req.params; // Nome para busca
        if (!nome) throw new Error('Nome é necessário');
        const tasks = await tasksModels.buscarClienteNome(nome);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const contarClientes = async (req, res) => {
    try {
        const tasks = await tasksModels.contarClientes();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};

const cadastrarPet = async (req, res) => {
    try {
        const tasks = await tasksModels.cadastrarPet(req.body); // Dados do pet vindos do corpo da requisição
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarPetId = async (req, res) => {
    try {
        const { id } = req.params; // ID do pet
        if (!id) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.listarPetId(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarPetCpfProp = async (req, res) => {
    try {
        const { cpf } = req.params;
        if (!cpf) throw new Error('CPF do proprietário é necessário');
        const tasks = await tasksModels.listarPetCpfProp(cpf);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarPet = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, especie, raca } = req.body;
        if (!id || !nome || !especie || !raca) throw new Error('Faltam dados para atualizar o pet');
        const tasks = await tasksModels.atualizarPet(id, nome, especie, raca);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarCampoPet = async (req, res) => {
    try {
        const { id, campo, valor } = req.body;
        if (!id || !campo || !valor) throw new Error('Faltam dados para atualização do pet');
        const tasks = await tasksModels.atualizarCampoPet(id, campo, valor);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const statusPet = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.statusPet(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarPet = async (req, res) => {
    try {
        const tasks = await tasksModels.listarPet();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const cadastrarVacina = async (req, res) => {
    try {
        const tasks = await tasksModels.cadastrarVacina(req.body);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const buscarVacinaId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('ID da vacina é necessário');
        const tasks = await tasksModels.buscarVacinaId(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarVacinasPet = async (req, res) => {
    try {
        const { id_pet } = req.params;
        if (!id_pet) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.listarVacinasPet(id_pet);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarVacina = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data } = req.body;
        if (!id || !nome || !data) throw new Error('Faltam dados para atualizar a vacina');
        const tasks = await tasksModels.atualizarVacina(id, nome, data);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarVacinas = async (req, res) => {
    try {
        const tasks = await tasksModels.listarVacinas();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const cadastrarProcedimento = async (req, res) => {
    try {
        const tasks = await tasksModels.cadastrarProcedimento(req.body);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const buscarProcedimentoId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('ID do procedimento é necessário');
        const tasks = await tasksModels.buscarProcedimentoId(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarProcedimentos = async (req, res) => {
    try {
        const tasks = await tasksModels.listarProcedimentos();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarProcedimentosPet = async (req, res) => {
    try {
        const { id_pet } = req.params;
        if (!id_pet) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.listarProcedimentosPet(id_pet);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarProcedimento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data } = req.body;
        if (!id || !nome || !data) throw new Error('Faltam dados para atualizar o procedimento');
        const tasks = await tasksModels.atualizarProcedimento(id, nome, data);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const cadastrarMedicamento = async (req, res) => {
    try {
        const tasks = await tasksModels.cadastrarMedicamento(req.body);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const buscarMedicamentoId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error('ID do medicamento é necessário');
        const tasks = await tasksModels.buscarMedicamentoId(id);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarMedicamentosPet = async (req, res) => {
    try {
        const { id_pet } = req.params;
        if (!id_pet) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.listarMedicamentosPet(id_pet);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const atualizarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, dose } = req.body;
        if (!id || !nome || !dose) throw new Error('Faltam dados para atualizar o medicamento');
        const tasks = await tasksModels.atualizarMedicamento(id, nome, dose);
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};
const listarMedicamentos = async (req, res) => {
    try {
        const tasks = await tasksModels.listarMedicamentos();
        responderComSucesso(res, tasks);
    } catch (error) {
        responderComErro(res, error);
    }
};

module.exports = {
    responderComSucesso,
    responderComErro,
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