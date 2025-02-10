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
        const { cpf } = req.params; // Captura o CPF do cliente da URL
        const { senha, nome, celular, endereco } = req.body; // Campos a serem atualizados

        // Criação de um objeto com apenas os campos válidos
        const campos = {};

        if (senha !== undefined) campos.senha = senha;
        if (nome !== undefined) campos.nome = nome;
        if (celular !== undefined) campos.celular = celular;
        if (endereco !== undefined) campos.endereco = endereco;

        // Valida se pelo menos um campo foi passado para atualizar
        if (Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'Pelo menos um campo precisa ser informado para atualização.' });
        }

        // Chama o modelo para atualizar os campos do cliente
        const tasks = await tasksModels.atualizarCampoCliente(cpf, campos);
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
        const { id } = req.params; // Captura o ID do pet da URL
        const { nome, especie, raca, data_nasc, peso, cond_saude } = req.body; // Campos a serem atualizados

        // Criação de um objeto com apenas os campos válidos
        const campos = {};

        if (nome !== undefined) campos.nome = nome;
        if (especie !== undefined) campos.especie = especie;
        if (raca !== undefined) campos.raca = raca;
        if (data_nasc !== undefined) campos.data_nasc = data_nasc;
        if (peso !== undefined) campos.peso = peso;
        if (cond_saude !== undefined) campos.cond_saude = cond_saude;

        // Valida se pelo menos um campo foi passado para atualizar
        if (Object.keys(campos).length === 0) {
            return res.status(400).json({ error: 'Pelo menos um campo precisa ser informado para atualização.' });
        }

        // Chama o modelo para atualizar os campos do pet
        const tasks = await tasksModels.atualizarCampoPet(id, campos);
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
        const { nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !lote || !validade || !id_pet || !data_aplicacao || !veterinario) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        // Chama o modelo para cadastrar a vacina
        const result = await tasksModels.cadastrarVacina(nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao);

        return res.status(201).json({ success: 'Vacina cadastrada com sucesso', result });
    } catch (error) {
        console.error('Erro ao cadastrar vacina', error);
        return res.status(500).json({ error: 'Erro ao cadastrar vacina' });
    }
};

const buscarVacinaId = async (req, res) => {
    try {
        const { id } = req.params; // Captura o id da URL

        // Valida o ID
        if (!id) {
            return res.status(400).json({ error: 'ID da vacina é obrigatório.' });
        }

        // Chama o modelo para buscar a vacina pelo ID
        const vacina = await tasksModels.buscarVacinaId(id);

        return res.status(200).json(vacina);
    } catch (error) {
        console.error('Erro ao buscar vacina', error);
        return res.status(500).json({ error: 'Erro ao buscar vacina' });
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
// tasksController.js

const atualizarVacina = async (req, res) => {
    try {
        const { id } = req.params; // Captura o id da URL
        const { nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao } = req.body;

        // Cria um objeto que vai armazenar os valores atualizados, com as chaves que foram passadas
        let camposAtualizados = [];
        let valoresAtualizados = [];

        if (nome) {
            camposAtualizados.push('nome');
            valoresAtualizados.push(nome);
        }
        if (fabricante) {
            camposAtualizados.push('fabricante');
            valoresAtualizados.push(fabricante);
        }
        if (lote) {
            camposAtualizados.push('lote');
            valoresAtualizados.push(lote);
        }
        if (validade) {
            camposAtualizados.push('validade');
            valoresAtualizados.push(validade);
        }
        if (id_pet) {
            camposAtualizados.push('id_pet');
            valoresAtualizados.push(id_pet);
        }
        if (data_aplicacao) {
            camposAtualizados.push('data_aplicacao');
            valoresAtualizados.push(data_aplicacao);
        }
        if (veterinario) {
            camposAtualizados.push('veterinario');
            valoresAtualizados.push(veterinario);
        }
        if (prox_aplicacao) {
            camposAtualizados.push('prox_aplicacao');
            valoresAtualizados.push(prox_aplicacao);
        }

        // Se nenhum campo foi enviado, retorna um erro
        if (camposAtualizados.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
        }

        // Chama o model para atualizar a vacina
        const resultado = await tasksModels.atualizarVacina(id, camposAtualizados, valoresAtualizados);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Vacina não encontrada.' });
        }

        return res.status(200).json({ success: 'Vacina atualizada com sucesso', result: resultado });
    } catch (error) {
        console.error('Erro ao atualizar vacina', error);
        return res.status(500).json({ error: 'Erro ao atualizar vacina' });
    }
};

const cadastrarProcedimento = async (req, res) => {
    try {
        const { id_pet, tipo, descricao, data_procedimento, veterinario } = req.body;

        // Valida se todos os campos foram enviados
        if (!id_pet || !tipo || !descricao || !data_procedimento || !veterinario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Criação da consulta SQL
        const query = `
            INSERT INTO procedimentos (id_pet, tipo, descricao, data_procedimento, veterinario)
            VALUES (?, ?, ?, ?, ?);
        `;

        // Executa a consulta com os valores recebidos
        const [resultado] = await connection.execute(query, [
            id_pet, tipo, descricao, data_procedimento, veterinario
        ]);

        // Retorna a resposta de sucesso
        return res.status(201).json({
            success: 'Procedimento cadastrado com sucesso',
            result: resultado
        });
    } catch (error) {
        console.error('Erro ao cadastrar procedimento:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar procedimento' });
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
        const { id } = req.params; // Captura o id da URL
        const { id_pet, tipo, descricao, data_procedimento, veterinario } = req.body;

        // Cria um objeto para armazenar os campos atualizados e os valores
        let camposAtualizados = [];
        let valoresAtualizados = [];

        // Verifica quais campos foram enviados e adiciona à lista
        if (id_pet) {
            camposAtualizados.push('id_pet');
            valoresAtualizados.push(id_pet);
        }
        if (tipo) {
            camposAtualizados.push('tipo');
            valoresAtualizados.push(tipo);
        }
        if (descricao) {
            camposAtualizados.push('descricao');
            valoresAtualizados.push(descricao);
        }
        if (data_procedimento) {
            camposAtualizados.push('data_procedimento');
            valoresAtualizados.push(data_procedimento);
        }
        if (veterinario) {
            camposAtualizados.push('veterinario');
            valoresAtualizados.push(veterinario);
        }

        // Se nenhum campo foi enviado, retorna um erro
        if (camposAtualizados.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
        }

        // Adiciona o id do procedimento ao final dos valores
        valoresAtualizados.push(id);

        // Gera a consulta SQL com os campos atualizados
        const query = `
            UPDATE procedimentos 
            SET ${camposAtualizados.map(campo => `${campo} = ?`).join(', ')} 
            WHERE id = ?;
        `;

        // Executa a consulta com os valores atualizados
        const [resultado] = await connection.execute(query, valoresAtualizados);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Procedimento não encontrado.' });
        }

        return res.status(200).json({ success: 'Procedimento atualizado com sucesso', result: resultado });
    } catch (error) {
        console.error('Erro ao atualizar procedimento:', error);
        return res.status(500).json({ error: 'Erro ao atualizar procedimento' });
    }
};

const cadastrarMedicamento = async (req, res) => {
    try {
        const { id_pet, nome_medicamento, dosagem, frequencia, data_inicio, data_fim } = req.body;

        // Chama o model passando os parâmetros corretos
        const novoMedicamento = await tasksModels.cadastrarMedicamento(id_pet, nome_medicamento, dosagem, frequencia, data_inicio, data_fim);
        
        responderComSucesso(res, novoMedicamento);
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
        const dados = req.body; // Pega apenas os campos enviados

        if (!id || Object.keys(dados).length === 0) {
            throw new Error('Nenhum dado fornecido para atualização.');
        }

        const resultado = await tasksModels.atualizarMedicamento(id, dados);
        responderComSucesso(res, resultado);
    } catch (error) {
        responderComErro(res, error);
    }
};

module.exports = {
    responderComSucesso,
    responderComErro,
    cadastrarCliente,
    buscarClienteCpf,
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
    cadastrarProcedimento,
    buscarProcedimentoId,
    listarProcedimentosPet,
    atualizarProcedimento,
    cadastrarMedicamento,
    buscarMedicamentoId,
    listarMedicamentosPet,
    atualizarMedicamento,
};