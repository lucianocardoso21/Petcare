const connection = require('./connection');

/** Cadastrar Cliente */
const cadastrarCliente = async (cpf, senha, nome, celular, endereco) => {
    try {
        // Validação de dados
        if (!cpf || !senha || !nome || !celular || !endereco) {
            throw new Error('Dados inválidos para cadastro de cliente');
        }

        const query = await connection.execute(
            'INSERT INTO clientes(cpf, senha, nome, celular, endereco, data_entrada) VALUES (?, ?, ?, ?, ?, NOW());',
            [cpf, senha, nome, celular, endereco]
        );
        return query;
    } catch (error) {
        console.error('Falha ao cadastrar cliente', error);
        throw new Error('Erro ao cadastrar cliente');
    }
};

/** Buscar Cliente por CPF */
const buscarClienteCpf = async (cpf) => {
    try {
        if (!cpf) {
            throw new Error('CPF inválido');
        }

        const [cliente] = await connection.execute(
            'SELECT * FROM clientes WHERE cpf = ?;',
            [cpf]
        );

        if (cliente.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        return cliente;
    } catch (error) {
        console.error('Falha ao buscar cliente', error);
        throw new Error('Erro ao buscar cliente');
    }
};

/** Buscar Cliente por Nome */
const buscarClienteNome = async (nome) => {
    try {
        if (!nome) {
            throw new Error('Nome inválido');
        }

        const [clientes] = await connection.execute(
            'SELECT * FROM clientes WHERE nome LIKE ?;',
            [`%${nome}%`]
        );

        return clientes;
    } catch (error) {
        console.error('Falha ao buscar cliente', error);
        throw new Error('Erro ao buscar cliente');
    }
};

/** Atualizar Cliente */
const atualizarCliente = async (cpf, senha, nome, celular, endereco) => {
    try {
        if (!cpf || !senha || !nome || !celular || !endereco) {
            throw new Error('Dados inválidos para atualização de cliente');
        }

        const query = await connection.execute(
            'UPDATE clientes SET senha = ?, nome = ?, celular = ?, endereco = ? WHERE cpf = ?;',
            [senha, nome, celular, endereco, cpf]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar cliente', error);
        throw new Error('Erro ao atualizar cliente');
    }
};

/** Alterar Status do Cliente */
const statusCliente = async (cpf) => {
    try {
        if (!cpf) {
            throw new Error('CPF inválido');
        }

        const [cliente] = await connection.execute(
            'SELECT status FROM clientes WHERE cpf = ?;',
            [cpf]
        );

        if (cliente.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        const novoStatus = cliente[0].status === 'ativo' ? 'inativo' : 'ativo';
        const query = await connection.execute(
            'UPDATE clientes SET status =? WHERE cpf =?;',
            [novoStatus, cpf]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar status do cliente', error);
        throw new Error('Erro ao atualizar status do cliente');
    }
};

/** Listar Clientes */
const listarClientes = async (status = 'todos') => {
    try {
        let query;
        let param = [];

        if (status === 'todos') {
            query = 'SELECT * FROM clientes;';
        } else {
            query = 'SELECT * FROM clientes WHERE status = ?;';
            param = [status];
        }

        const [result] = await connection.execute(query, param);
        return result;
    } catch (error) {
        console.error('Falha ao listar clientes', error);
        throw new Error('Erro ao listar clientes');
    }
};

/** Verificar Cliente Existente */
const verificarClienteExistente = async (cpf) => {
    try {
        if (!cpf) {
            throw new Error('CPF inválido');
        }

        const [cliente] = await connection.execute(
            'SELECT * FROM clientes WHERE cpf = ?;',
            [cpf]
        );

        // Se o cliente não for encontrado, retorna null
        if (cliente.length === 0) {
            return null; // Retorna null quando não encontrado
        }

        return cliente;
    } catch (error) {
        console.error('Falha ao verificar cliente existente', error);
        throw error; // Apenas re-lança o erro para o controller tratar
    }
};



/** Atualizar Campo de Cliente */
const atualizarCampoCliente = async (cpf, campo, valor) => {
    try {
        if (!cpf || !campo || valor === undefined) {
            throw new Error('Dados inválidos para atualização de campo de cliente');
        }

        const query = await connection.execute(
            `UPDATE clientes SET ${campo} = ? WHERE cpf = ?;`,
            [valor, cpf]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar campo do cliente', error);
        throw new Error('Erro ao atualizar campo do cliente');
    }
};

/** Contar Total de Clientes */
const contarClientes = async () => {
    try {
        const [result] = await connection.execute(
            'SELECT COUNT(*) AS total FROM clientes;'
        );

        return result;
    } catch (error) {
        console.error('Falha ao contar clientes', error);
        throw new Error('Erro ao contar clientes');
    }
};

/** TABELA PETS */

/** Cadastrar Pet */
const cadastrarPet = async (nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude) => {
    try {
        if (!nome || !cpf_prop || !proprietario || !especie || !raca || !data_nasc || !peso || !cond_saude) {
            throw new Error('Dados inválidos para cadastro de pet');
        }

        const query = await connection.execute(
            'INSERT INTO pets (nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude]
        );
        return query;
    } catch (error) {
        console.error('Falha ao cadastrar pet', error);
        throw new Error('Erro ao cadastrar pet');
    }
};

/** Listar Pet por ID */
const listarPetId = async (id) => {
    try {
        if (!id) {
            throw new Error('ID inválido');
        }

        const [pet] = await connection.execute(
            'SELECT * FROM pets WHERE id = ?;',
            [id]
        );

        if (pet.length === 0) {
            throw new Error('Pet não encontrado');
        }

        return pet;
    } catch (error) {
        console.error('Falha ao listar pet por ID', error);
        throw new Error('Erro ao listar pet por ID');
    }
};

/** Listar Pets por CPF do Proprietário */
const listarPetCpfProp = async (cpf_prop, status = 'todos') => {
    try {
        if (!cpf_prop) {
            throw new Error('CPF do proprietário inválido');
        }

        let query;
        let param = [cpf_prop];

        if (status === 'todos') {
            query = 'SELECT * FROM pets WHERE cpf_prop = ?;';
        } else {
            query = 'SELECT * FROM pets WHERE cpf_prop = ? AND status = ?;';
            param.push(status);
        }

        const [result] = await connection.execute(query, param);
        return result;
    } catch (error) {
        console.error('Falha ao listar pets do proprietário', error);
        throw new Error('Erro ao listar pets do proprietário');
    }
};

/** Atualizar Pet */
const atualizarPet = async (id, nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude) => {
    try {
        if (!id || !nome || !cpf_prop || !proprietario || !especie || !raca || !data_nasc || !peso || !cond_saude) {
            throw new Error('Dados inválidos para atualização de pet');
        }

        const query = await connection.execute(
            'UPDATE pets SET nome = ?, cpf_prop = ?, proprietario = ?, especie = ?, raca = ?, data_nasc = ?, peso = ?, cond_saude = ? WHERE id = ?;',
            [nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude, id]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar pet', error);
        throw new Error('Erro ao atualizar pet');
    }
};

/** Atualizar Campo de Pet */
const atualizarCampoPet = async (id, campo, valor) => {
    try {
        if (!id || !campo || valor === undefined) {
            throw new Error('Dados inválidos para atualização de campo de pet');
        }

        const query = await connection.execute(
            `UPDATE pets SET ${campo} = ? WHERE id = ?;`,
            [valor, id]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar campo do pet', error);
        throw new Error('Erro ao atualizar campo do pet');
    }
};

/** Alterar Status do Pet */
const statusPet = async (id) => {
    try {
        if (!id) {
            throw new Error('ID inválido');
        }

        const [pet] = await connection.execute(
            'SELECT status FROM pets WHERE id = ?;',
            [id]
        );

        if (pet.length === 0) {
            throw new Error('Pet não encontrado');
        }

        const novoStatus = pet[0].status === 'ativo' ? 'inativo' : 'ativo';
        const query = await connection.execute(
            'UPDATE pets SET status = ? WHERE id = ?;',
            [novoStatus, id]
        );

        return query;
    } catch (error) {
        console.error('Falha ao atualizar status do pet', error);
        throw new Error('Erro ao atualizar status do pet');
    }
};

/** Listar Todos os Pets */
const listarPet = async () => {
    try {
        const [result] = await connection.execute(
            'SELECT * FROM pets;'
        );
        return result;
    } catch (error) {
        console.error('Falha ao listar todos os pets', error);
        throw new Error('Erro ao listar todos os pets');
    }
};

/** TABELA VACINAS */

/** Cadastrar Vacina */
const cadastrarVacina = async (id_pet, nome, veterinario, data, lote, px_dose) => {
    try {
        if (!id_pet || !nome || !veterinario || !data || !lote || !px_dose) {
            throw new Error('Dados inválidos para cadastro de vacina');
        }

        const query = await connection.execute(
            'INSERT INTO vacinas (id_pet, nome, veterinario, data, lote, px_dose) VALUES (?, ?, ?, ?, ?, ?);',
            [id_pet, nome, veterinario, data, lote, px_dose]
        );
        return query;
    } catch (error) {
        console.error('Erro ao cadastrar vacina:', error);
        throw new Error('Falha ao cadastrar vacina');
    }
};

/** Buscar Vacina por ID */
const buscarVacinaId = async (id) => {
    try {
        if (!id) {
            throw new Error('ID inválido');
        }

        const [vacina] = await connection.execute(
            'SELECT * FROM vacinas WHERE id = ?;',
            [id]
        );

        if (vacina.length === 0) {
            throw new Error('Vacina não encontrada');
        }

        return vacina;
    } catch (error) {
        console.error('Erro ao buscar vacina:', error);
        throw new Error('Falha ao buscar vacina');
    }
};

/** Listar Vacinas de um Pet */
const listarVacinasPet = async (id_pet) => {
    try {
        if (!id_pet) {
            throw new Error('ID do pet inválido');
        }

        const [vacinas] = await connection.execute(
            'SELECT * FROM vacinas WHERE id_pet = ?;',
            [id_pet]
        );
        return vacinas;
    } catch (error) {
        console.error('Erro ao listar vacinas do pet:', error);
        throw new Error('Falha ao listar vacinas');
    }
};

/** Atualizar Vacina */
const atualizarVacina = async (id, id_pet, nome, veterinario, data, lote, px_dose) => {
    try {
        if (!id || !id_pet || !nome || !veterinario || !data || !lote || !px_dose) {
            throw new Error('Dados inválidos para atualização de vacina');
        }

        const query = await connection.execute(
            'UPDATE vacinas SET id_pet = ?, nome = ?, veterinario = ?, data = ?, lote = ?, px_dose = ? WHERE id = ?;',
            [id_pet, nome, veterinario, data, lote, px_dose, id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao atualizar vacina:', error);
        throw new Error('Falha ao atualizar vacina');
    }
};

/** Listar Todas as Vacinas */
const listarVacinas = async () => {
    try {
        const [vacinas] = await connection.execute(
            'SELECT * FROM vacinas;'
        );
        return vacinas;
    } catch (error) {
        console.error('Erro ao listar vacinas:', error);
        throw new Error('Falha ao listar vacinas');
    }
};

/** TABELA PROCEDIMENTOS */

/** Cadastrar Procedimento */
const cadastrarProcedimento = async (id_pet, nome, veterinario, data, dose, motivo) => {
    try {
        if (!id_pet || !nome || !veterinario || !data || !dose || !motivo) {
            throw new Error('Dados inválidos para cadastro de procedimento');
        }

        const query = await connection.execute(
            'INSERT INTO procedimentos (id_pet, nome, veterinario, data, dose, motivo) VALUES (?, ?, ?, ?, ?, ?);',
            [id_pet, nome, veterinario, data, dose, motivo]
        );
        return query;
    } catch (error) {
        console.error('Erro ao cadastrar procedimento:', error);
        throw new Error('Falha ao cadastrar procedimento');
    }
};

/** Buscar Procedimento por ID */
const buscarProcedimentoId = async (id) => {
    try {
        if (!id) {
            throw new Error('ID inválido');
        }

        const [procedimento] = await connection.execute(
            'SELECT * FROM procedimentos WHERE id = ?;',
            [id]
        );

        if (procedimento.length === 0) {
            throw new Error('Procedimento não encontrado');
        }

        return procedimento;
    } catch (error) {
        console.error('Erro ao buscar procedimento:', error);
        throw new Error('Falha ao buscar procedimento');
    }
};

/** Listar Procedimentos de um Pet */
const listarProcedimentosPet = async (id_pet) => {
    try {
        if (!id_pet) {
            throw new Error('ID do pet inválido');
        }

        const [procedimentos] = await connection.execute(
            'SELECT * FROM procedimentos WHERE id_pet = ?;',
            [id_pet]
        );
        return procedimentos;
    } catch (error) {
        console.error('Erro ao listar procedimentos do pet:', error);
        throw new Error('Falha ao listar procedimentos');
    }
};

/** Atualizar Procedimento */
const atualizarProcedimento = async (id, id_pet, nome, veterinario, data, dose, motivo) => {
    try {
        if (!id || !id_pet || !nome || !veterinario || !data || !dose || !motivo) {
            throw new Error('Dados inválidos para atualização de procedimento');
        }

        const query = await connection.execute(
            'UPDATE procedimentos SET id_pet = ?, nome = ?, veterinario = ?, data = ?, dose = ?, motivo = ? WHERE id = ?;',
            [id_pet, nome, veterinario, data, dose, motivo, id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao atualizar procedimento:', error);
        throw new Error('Falha ao atualizar procedimento');
    }
};

/** Listar Todos os Procedimentos */
const listarProcedimentos = async () => {
    try {
        const [procedimentos] = await connection.execute(
            'SELECT * FROM procedimentos;'
        );
        return procedimentos;
    } catch (error) {
        console.error('Erro ao listar procedimentos:', error);
        throw new Error('Falha ao listar procedimentos');
    }
};

/** TABELA MEDICAMENTOS */

/** Cadastrar Medicamento */
const cadastrarMedicamento = async (id_pet, nome, veterinario, data, dose, motivo) => {
    try {
        if (!id_pet || !nome || !veterinario || !data || !dose || !motivo) {
            throw new Error('Dados inválidos para cadastro de medicamento');
        }

        const query = await connection.execute(
            'INSERT INTO medicamentos (id_pet, nome, veterinario, data, dose, motivo) VALUES (?, ?, ?, ?, ?, ?);',
            [id_pet, nome, veterinario, data, dose, motivo]
        );
        return query;
    } catch (error) {
        console.error('Erro ao cadastrar medicamento:', error);
        throw new Error('Falha ao cadastrar medicamento');
    }
};

/** Buscar Medicamento por ID */
const buscarMedicamentoId = async (id) => {
    try {
        if (!id) {
            throw new Error('ID inválido');
        }

        const [medicamento] = await connection.execute(
            'SELECT * FROM medicamentos WHERE id = ?;',
            [id]
        );

        if (medicamento.length === 0) {
            throw new Error('Medicamento não encontrado');
        }

        return medicamento;
    } catch (error) {
        console.error('Erro ao buscar medicamento:', error);
        throw new Error('Falha ao buscar medicamento');
    }
};

/** Listar Medicamentos de um Pet */
const listarMedicamentosPet = async (id_pet) => {
    try {
        if (!id_pet) {
            throw new Error('ID do pet inválido');
        }

        const [medicamentos] = await connection.execute(
            'SELECT * FROM medicamentos WHERE id_pet = ?;',
            [id_pet]
        );
        return medicamentos;
    } catch (error) {
        console.error('Erro ao listar medicamentos do pet:', error);
        throw new Error('Falha ao listar medicamentos');
    }
};

/** Atualizar Medicamento */
const atualizarMedicamento = async (id, id_pet, nome, veterinario, data, dose, motivo) => {
    try {
        if (!id || !id_pet || !nome || !veterinario || !data || !dose || !motivo) {
            throw new Error('Dados inválidos para atualização de medicamento');
        }

        const query = await connection.execute(
            'UPDATE medicamentos SET id_pet = ?, nome = ?, veterinario = ?, data = ?, dose = ?, motivo = ? WHERE id = ?;',
            [id_pet, nome, veterinario, data, dose, motivo, id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao atualizar medicamento:', error);
        throw new Error('Falha ao atualizar medicamento');
    }
};

/** Listar Todos os Medicamentos */
const listarMedicamentos = async () => {
    try {
        const [medicamentos] = await connection.execute(
            'SELECT * FROM medicamentos;'
        );
        return medicamentos;
    } catch (error) {
        console.error('Erro ao listar medicamentos:', error);
        throw new Error('Falha ao listar medicamentos');
    }
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