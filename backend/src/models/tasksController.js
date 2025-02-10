const tasksModels = require('./tasksModels');
const connection = require('./connection');

const responderComErro = (res, erro) => {
    return res.status(500).json({ error: erro.message || erro });
};

const responderComSucesso = (res, data) => {
    return res.status(200).json(data);
};

const cadastrarCliente = async (req, res) => {
    try {
        // Pegando os dados do corpo da requisição (JSON)
        const { cpf, senha, nome, celular, endereco } = req.body;
        
        // Chama o model para cadastrar o cliente
        const cliente = await tasksModels.cadastrarCliente(cpf, senha, nome, celular, endereco);

        // Envia resposta de sucesso
        responderComSucesso(res, cliente);
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
    const { cpf } = req.params; // Captura o cpf da URL
    const { senha, nome, celular, endereco } = req.body; // Captura os dados do corpo da requisição

    // Validação de dados
    if (!senha || !nome || !celular || !endereco) {
        return res.status(400).json({ error: 'Todos os campos (senha, nome, celular, endereco) são obrigatórios.' });
    }

    try {
        // Chama a função no modelo para atualizar o cliente
        const resultado = await tasksModels.atualizarCliente(cpf, senha, nome, celular, endereco);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        return res.status(200).json({ success: 'Cliente atualizado com sucesso', result: resultado });
    } catch (error) {
        console.error('Falha ao atualizar cliente', error);
        return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};


const statusCliente = async (req, res) => {
    const { cpf } = req.params;

    try {
        const [rows] = await connection.execute(
            'SELECT status FROM clientes WHERE cpf = ?',
            [cpf]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Retorna o status do cliente
        return res.status(200).json({ status: rows[0].status });
    } catch (error) {
        console.error('Falha ao buscar status do cliente', error);
        return res.status(500).json({ message: 'Erro ao buscar status do cliente' });
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

        // Verificar se o CPF foi passado
        if (!cpf) {
            return res.status(400).json({ error: 'CPF inválido' });
        }

        // Chamar a função do modelo
        const cliente = await tasksModels.verificarClienteExistente(cpf);

        // Se o cliente não for encontrado, retorna "Cliente não encontrado"
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Retorna o cliente se encontrado
        res.status(200).json(cliente);
    } catch {
        // Para erros não esperados
        return res.status(500).json({ error: 'Erro ao verificar cliente existente' });
    }
};


const atualizarCampoCliente = async (req, res) => {
    try {
        const { cpf, campo, valor } = req.body; // Campos a serem atualizados
        if (!cpf || !campo || !valor) throw new Error('Faltando dados para atualização');
        const tasks = await tasksModels.atualizarCampoCliente(cpf, campo, valor);
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

const alterarStatusCliente = async (req, res) => {
    try {
        const { cpf } = req.params; // Recebe o CPF do cliente
        if (!cpf) throw new Error('CPF do cliente é necessário');

        const resultado = await tasksModels.alterarStatusCliente(cpf);

        if (!resultado) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        return res.status(200).json({ success: 'Status do cliente alterado com sucesso' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const cadastrarPet = async (req, res) => {
    try {
        // Desestruturando os dados do corpo da requisição
        const { nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude } = req.body;

        // Passando os dados desestruturados para o modelo
        const tasks = await tasksModels.cadastrarPet(nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude); 
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

const listarPetId = async (req, res) => {
    try {
        const { id } = req.params; // ID do pet
        if (!id) throw new Error('ID do pet é necessário');
        const tasks = await tasksModels.listarPetId(id); // Chama a função no modelo
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

const alterarStatusPet = async (req, res) => {
    try {
        const { id } = req.params; // Recebe o ID do pet
        if (!id) throw new Error('ID do pet é necessário');

        const resultado = await tasksModels.alterarStatusPet(id);

        if (!resultado) {
            return res.status(404).json({ error: 'Pet não encontrado' });
        }

        return res.status(200).json({ success: 'Status do pet alterado com sucesso' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

/** TABELA VACINAS */

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
    alterarStatusCliente,
    cadastrarPet,
    listarPetId,
    listarPetCpfProp,
    atualizarPet,
    atualizarCampoPet,
    statusPet,
    listarPet,
    alterarStatusPet,
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