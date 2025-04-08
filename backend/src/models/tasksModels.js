const connection = require('./connection');
// const jwt = require('jsonwebtoken');


/** Cadastrar Cliente */
const cadastrarCliente = async (cpf, senha, nome, sobrenome, celular, endereco) => {
    try {
        // Validação de dados
        if (!cpf || !senha || !nome || !sobrenome || !celular || !endereco) {
            throw new Error('Dados inválidos para cadastro de cliente');
        }

        const query = await connection.execute(
            'INSERT INTO clientes(cpf, senha, nome, sobrenome, celular, endereco, data_entrada) VALUES (?, ?, ?, ?, ?, ?, NOW());',
            [cpf, senha, nome, sobrenome, celular, endereco]
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
const atualizarCampoCliente = async (cpf, campos) => {
    try {
        // Criação da lista de atualizações no formato 'campo = valor'
        const atualizacoes = Object.keys(campos)
            .map(campo => `${campo} = ?`)
            .join(', ');

        // Criação dos valores a serem passados para a query
        const valores = Object.values(campos);

        // Adiciona o CPF como o último valor para a query
        valores.push(cpf);

        // Query SQL para atualizar múltiplos campos
        const query = await connection.execute(
            `UPDATE clientes SET ${atualizacoes} WHERE cpf = ?`,
            valores
        );

        return query;
    } catch (error) {
        console.error('Erro ao atualizar campos do cliente', error);
        throw new Error('Erro ao atualizar campos do cliente');
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

const alterarStatusCliente = async (cpf) => {
    try {
        // Busca o status atual do cliente usando o cpf
        const [cliente] = await connection.execute('SELECT status FROM clientes WHERE cpf = ?', [cpf]);

        if (cliente.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        // Inverte o status: se for 'ativo' vai para 'inativo' e vice-versa
        const novoStatus = cliente[0].status === 'ativo' ? 'inativo' : 'ativo';

        // Atualiza o status do cliente
        await connection.execute('UPDATE clientes SET status = ? WHERE cpf = ?', [novoStatus, cpf]);

        return true;
    } catch (error) {
        console.error('Erro ao alterar status do cliente', error);
        throw new Error('Erro ao alterar status do cliente');
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
const listarPetCpfProp = async (cpf_prop) => {
    try {
        const query = `
            SELECT 
                pets.id, 
                pets.nome, 
                pets.cpf_prop, 
                pets.proprietario, 
                pets.especie, 
                pets.raca, 
                pets.data_nasc, 
                pets.peso, 
                pets.cond_saude, 
                pets.status,
                pets.data_alteracao
            FROM pets 
            WHERE pets.cpf_prop = ?;
        `;
        const [result] = await connection.execute(query, [cpf_prop]);
        console.log('Resultado da query:', result);
        // Calcular a idade de cada pet usando a função calcularIdade
        result.forEach(pet => {
            console.log('Data de nascimento do pet:', pet.data_nasc);
            pet.idade = calcularIdade(pet.data_nasc);  // Calcula e atribui a idade ao pet
            console.log('Idade calculada do pet:', pet.idade);
        });

        console.log('Resultado da query com idade calculada:', result);
        return result;
    } catch (error) {
        console.error('Erro ao listar pets por cpf_prop:', error);
        throw error;
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
const atualizarCampoPet = async (id, campos) => {
    try {
        // Criação da lista de atualizações no formato 'campo = valor'
        const atualizacoes = Object.keys(campos)
            .map(campo => `${campo} = ?`)
            .join(', ');

        // Criação dos valores a serem passados para a query
        const valores = Object.values(campos);

        // Adiciona o ID como o último valor para a query
        valores.push(id);

        // Query SQL para atualizar múltiplos campos
        const query = await connection.execute(
            `UPDATE pets SET ${atualizacoes} WHERE id = ?`,
            valores
        );

        return query;
    } catch (error) {
        console.error('Erro ao atualizar campos do pet', error);
        throw new Error('Erro ao atualizar campos do pet');
    }
};

/** Consultar Status do Pet */
const statusPet = async (id) => {
    try {
        if (!id) throw new Error('ID do pet é necessário');

        const query = await connection.execute(
            'SELECT status FROM pets WHERE id = ?',
            [id]
        );

        if (query[0].length === 0) {
            throw new Error('Pet não encontrado');
        }

        return query[0][0]; // Retorna o status do pet
    } catch (error) {
        console.error('Erro ao buscar status do pet', error);
        throw new Error('Erro ao buscar status do pet');
    }
};

/** Listar Todos os Pets */
const listarPet = async () => {
    try {
        const [result] = await connection.execute(
            'SELECT id, nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude, status FROM pets;'
        );

        // Adiciona o campo idade ao resultado
        const petsComIdade = result.map(pet => ({
            ...pet,
            idade: calcularIdade(pet.data_nasc)
        }));

        return petsComIdade;
    } catch (error) {
        console.error('Falha ao listar todos os pets', error);
        throw new Error('Erro ao listar todos os pets');
    }
};

// Função para calcular a idade a partir da data de nascimento
function calcularIdade(dataNasc) {
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    
    // Ajusta o número de anos se o mês atual ainda não tiver passado o mês de nascimento
    if (meses < 0) {
        anos--;
        meses += 12;  // Adiciona 12 meses
    }
    
    // Ajusta os meses caso a data atual seja antes do dia de nascimento no mês
    const diaNascimento = nascimento.getDate();
    const diaHoje = hoje.getDate();
    if (meses === 0 && diaHoje < diaNascimento) {
        meses = 11;
        anos--;
    }

    return `${anos} anos e ${meses} meses`;
};

const alterarStatusPet = async (id) => {
    try {
        // Busca o status atual do pet usando o id
        const [pet] = await connection.execute('SELECT status FROM pets WHERE id = ?', [id]);

        if (pet.length === 0) {
            throw new Error('Pet não encontrado');
        }

        // Inverte o status: se for 'ativo' vai para 'inativo' e vice-versa
        const novoStatus = pet[0].status === 'ativo' ? 'inativo' : 'ativo';

        // Atualiza o status do pet
        await connection.execute('UPDATE pets SET status = ? WHERE id = ?', [novoStatus, id]);

        return true;
    } catch (error) {
        console.error('Erro ao alterar status do pet', error);
        throw new Error('Erro ao alterar status do pet');
    }
};

/** TABELA VACINAS */

/** Cadastrar Vacina */
const cadastrarVacina = async (nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao) => {
    try {
        console.log('📌 Dados recebidos no modelo:', { nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao });

        // Executa a query de inserção no banco de dados
        const [result] = await connection.execute(
            'INSERT INTO vacinas (nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [nome, fabricante, lote, validade, id_pet, data_aplicacao, veterinario, prox_aplicacao]
        );

        console.log('✅ Vacina cadastrada no banco:', result);
        return result;
    } catch (error) {
        console.error('❌ Erro ao cadastrar vacina:', error.message);
        throw error;
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

const atualizarVacina = async (id, camposAtualizados, valoresAtualizados) => {
    try {
        // Gera a consulta SQL com os campos atualizados
        const query = `UPDATE vacinas SET ${camposAtualizados.map(campo => `${campo} = ?`).join(', ')} WHERE id = ?`;

        // Adiciona o id da vacina ao final dos valores
        valoresAtualizados.push(id);

        // Executa a query no banco
        const [resultado] = await connection.execute(query, valoresAtualizados);

        return resultado; // Retorna o resultado da operação
    } catch (error) {
        console.error('Erro ao atualizar vacina no model:', error);
        throw new Error('Erro ao atualizar vacina');
    }
};

/** Remover Vacina */
const removerVacina = async (id) => {
    try {
        if (!id) {
            throw new Error('ID da vacina inválido');
        }

        const [resultado] = await connection.execute(
            'DELETE FROM vacinas WHERE id = ?;',
            [id]
        );

        if (resultado.affectedRows === 0) {
            throw new Error('Vacina não encontrada para remoção');
        }

        console.log(`✅ Vacina com ID ${id} removida com sucesso`);
        return resultado;
    } catch (error) {
        console.error('❌ Erro ao remover vacina:', error.message);
        throw new Error('Erro ao remover vacina');
    }
};


/** TABELA PROCEDIMENTOS */

/** Cadastrar Procedimento */
const cadastrarProcedimento = async (nome, descricao, id_pet, data, veterinario) => {
    try {
        const query = 'INSERT INTO procedimentos (nome, descricao, id_pet, data, veterinario) VALUES (?, ?, ?, ?, ?)';
        const [resultado] = await connection.execute(query, [nome, descricao, id_pet, data, veterinario]);
        return resultado;
    } catch (error) {
        console.error('Erro ao cadastrar procedimento no model:', error);
        throw new Error('Erro ao cadastrar procedimento');
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

/** TABELA MEDICAMENTOS */

/** Cadastrar Medicamento */
const cadastrarMedicamento = async (id_pet, nome_medicamento, dosagem, frequencia, data_inicio, data_fim = null, observacoes = null) => {
    try {
        // Validação dos campos obrigatórios
        if (!id_pet || !nome_medicamento?.trim() || !dosagem?.trim() || !frequencia?.trim() || !data_inicio) {
            throw new Error('Campos obrigatórios: id_pet, nome_medicamento, dosagem, frequencia, data_inicio');
        }

        const [result] = await connection.execute(
            'INSERT INTO medicamentos (id_pet, nome_medicamento, dosagem, frequencia, data_inicio, data_fim, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                id_pet,
                nome_medicamento.trim(),
                dosagem.trim(),
                frequencia.trim(),
                data_inicio,
                data_fim || null,  // Garante null se for string vazia
                observacoes?.trim() || null  // Trim se existir, senão null
            ]
        );

        return {
            id: result.insertId,
            success: true,
            message: 'Medicamento cadastrado com sucesso'
        };
    } catch (error) {
        console.error('Erro no model ao cadastrar medicamento:', error);
        throw error;
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
const atualizarMedicamento = async (id, dados) => {
    try {
        if (!id || Object.keys(dados).length === 0) {
            throw new Error('Nenhum dado fornecido para atualização.');
        }

        // Criar query dinâmica
        const campos = Object.keys(dados).map(campo => `${campo} = ?`).join(', ');
        const valores = Object.values(dados);
        
        const query = `UPDATE medicamentos SET ${campos} WHERE id = ?;`;
        
        // Executa a query com os valores e o ID
        const resultado = await connection.execute(query, [...valores, id]);

        return resultado;
    } catch (error) {
        console.error('Erro ao atualizar medicamento:', error);
        throw new Error('Falha ao atualizar medicamento');
    }
};

/** Excluir medicamento */
const excluirMedicamentoId = async (id) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID invalido');
        }
        const [medicamento] = await connection.execute(
            'SELECT id FROM medicamentos WHERE id = ?', [id]
        );
        if (medicamento.length === 0) {
            throw new Error('Medicamento não encontrado.');
        }
        const [result] = await connection.execute(
            'DELETE FROM medicamentos WHERE id = ?', [id]
        );
        if (result.affectedRows === 0) {
            throw new Error('Nenhum medicamento foi removido.');
        }
        return {
            success: true,
            message: 'Medicamento removido com sucesso!',
            affectedRows: result.affectedRows,
            deletedId: id
        };
    } catch (error) {
        console.error('Erro ao remover medicamento', error);
    }
};

// Função para autenticar o cliente pelo CPF
const autenticarClientePorCpf = async (cpf) => {
    const query = 'SELECT * FROM clientes WHERE cpf = ?';
    const [rows] = await connection.execute(query, [cpf]);

    if (rows.length === 0) {
        return null; // Retorna null caso o cliente não exista
    }

    return rows[0]; // Retorna o cliente encontrado
};

module.exports = {
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
    removerVacina,
    cadastrarProcedimento,
    buscarProcedimentoId,
    listarProcedimentosPet,
    atualizarProcedimento,
    cadastrarMedicamento,
    buscarMedicamentoId,
    listarMedicamentosPet,
    atualizarMedicamento,
    excluirMedicamentoId,
    autenticarClientePorCpf,
};