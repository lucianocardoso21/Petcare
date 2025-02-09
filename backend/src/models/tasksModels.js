const connection = require('./connection');

/** TABELA CLIENTES */
const cadastrarCliente = async (cpf, senha, nome, celular, endereco)=>{
    try {const query = await connection.execute(
        'INSERT INTO clientes(cpf, senha, nome, celular, endereco, data_entrada) VALUES (?, ?, ?, ?, ?, NOW());',
        [cpf, senha, nome, celular, endereco]
    );
    return query;
    } catch (error) {
        console.error('Falha ao cadastrar cliente',error);
        throw new Error('Erro ao cadastrar cliente');
    }
};
const buscarClienteCpf = async (cpf)=>{
    const query = await connection.execute(
        'SELECT * FROM clientes WHERE cpf = ?;',
        [cpf]
    );
    return query;
};
const buscarClienteNome = async(nome)=>{
    const query = await connection.execute(
        'SELECT * FROM clientes WHERE nome LIKE ?;',
        [`%${nome}%`]
    );
    return query;
};
const atualizarCliente = async (cpf, senha, nome, celular, endereco)=>{
    const query = await connection.execute(
        'UPDATE clientes SET senha = ?, nome = ?, celular = ?, endereco = ? WHERE cpf = ?;',
        [senha, nome, celular, endereco, cpf]
    );
    return query;
};
const statusCliente = async(cpf)=>{
    const [cliente] = await connection.execute(
        'SELECT status FROM clientes WHERE cpf = ?;',
        [cpf]
    );
    if (cliente.length === 0){
        throw new Error('Cliente não encontrado');
    }
    const novoStatus = cliente[0].status === 'ativo'?'inativo':'ativo';
    const query = await connection.execute(
        'UPDATE clientes SET status =? WHERE cpf =?;',
        [novoStatus, cpf]
    );
    return query;
};
const listarClientes = async (status='todos')=>{
    let query;
    let param = [];
    if (status === 'todos'){
        query = 'SELECT * FROM clientes;';
    }else{
        query = 'SELECT * FROM clientes WHERE status = ?;';
        param = [status];
    }
    const result= await connection.execute(query, param);
    return result;
};
const verificarClienteExistente = async (cpf)=>{
    const query = await connection.execute(
        'SELECT * FROM clientes WHERE cpf = ?;',
        [cpf]
    );
    return query;
};
const atualizarCampoCliente = async(cpf, campo, valor)=>{
    const query = await connection.execute(
        `UPDATE clientes SET ${campo} = ? WHERE cpf = ?;`,
        [valor,cpf]
    );
    return query;
};
const contarClientes = async()=>{
    const query = await connection.execute(
        'SELECT COUNT(*) AS total FROM clientes;'
    );
    return query;
};

/** TABELA PETS */
const cadastrarPet = async(nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude)=>{
    const query = await connection.execute(
        'INSERT INTO pets (nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude] 
    );
    return query;
};
const listarPetId = async(id)=>{
    const query = await connection.execute(
        'SELECT * FROM pets WHERE id = ?;',
        [id]
    );
    return query;
};
const listarPetCpfProp = async (cpf_prop, status='todos')=>{
    let query;
    let param = [cpf_prop];
    if (status === 'todos'){
        query = 'SELECT * FROM pets WHERE cpf_prop = ?;';
    }else{
        query = 'SELECT * FROM pets WHERE cpf_prop = ? AND status = ?;';
        param.push(status);
    }
    const result = await connection.execute(query, param);
    return result;
};
const atualizarPet = async (id, nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude)=>{
    const query = await connection.execute(
        'UPDATE pets SET nome=?, cpf_prop=?, proprietário=?, espécie=?, raça=?, data_nasc=?, peso=?, cond_saude=? WHERE id=?',
        [nome, cpf_prop, proprietario, especie, raca, data_nasc, peso, cond_saude, id]
    );
    return query;
};
const atualizarCampoPet = async (id, campo, valor)=>{
    const query = await connection.execute(
        `UPDATE pets SET ${campo} = ? WHERE id = ?;`,
        [valor, id]
    );
    return query;
};
const statusPet = async (id)=>{
    const [pet] = await connection.execute(
        'SELECT status FROM pets WHERE id =?;',
        [id]
    );
    if (pet.length === 0){
        throw new Error('Pet não encontrado');
    };
    const novoStatus = pet[0].status === 'ativo'?'inativo':'ativo';
    const query = await connection.execute('UPDATE pets SET status =? WHERE id =?',
        [novoStatus, id]
    );
    return query;
};
const listarPet = async ()=>{
    const query = await connection.execute(
        'SELECT * FROM pets;'
    );
    return query;
};

/** TABELA VACINAS */

const cadastrarVacina = async (id_pet, nome, veterinario, data, lote, px_dose) => {
    try {
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

const buscarVacinaId = async (id) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM vacinas WHERE id = ?;',
            [id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao buscar vacina:', error);
        throw new Error('Falha ao buscar vacina');
    }
};

const listarVacinasPet = async (id_pet) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM vacinas WHERE id_pet = ?;',
            [id_pet]
        );
        return query;
    } catch (error) {
        console.error('Erro ao listar vacinas do pet:', error);
        throw new Error('Falha ao listar vacinas');
    }
};

const atualizarVacina = async (id, id_pet, nome, veterinario, data, lote, px_dose) => {
    try {
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

const listarVacinas = async () => {
    try {
        const query = await connection.execute(
            'SELECT * FROM vacinas;'
        );
        return query;
    } catch (error) {
        console.error('Erro ao listar vacinas:', error);
        throw new Error('Falha ao listar vacinas');
    }
};

/** TABELA PROCEDIMENTOS */

// Cadastrar procedimento
const cadastrarProcedimento = async (id_pet, nome, veterinario, data, dose, motivo) => {
    try {
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

const buscarProcedimentoId = async (id) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM procedimentos WHERE id = ?;',
            [id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao buscar procedimento:', error);
        throw new Error('Falha ao buscar procedimento');
    }
};

const listarProcedimentosPet = async (id_pet) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM procedimentos WHERE id_pet = ?;',
            [id_pet]
        );
        return query;
    } catch (error) {
        console.error('Erro ao listar procedimentos do pet:', error);
        throw new Error('Falha ao listar procedimentos');
    }
};

const atualizarProcedimento = async (id, id_pet, nome, veterinario, data, dose, motivo) => {
    try {
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

const listarProcedimentos = async () => {
    try {
        const query = await connection.execute(
            'SELECT * FROM procedimentos;'
        );
        return query;
    } catch (error) {
        console.error('Erro ao listar procedimentos:', error);
        throw new Error('Falha ao listar procedimentos');
    }
};

/** TABELA MEDICAMENTOS */

const cadastrarMedicamento = async (id_pet, nome, veterinario, data, dose, motivo) => {
    try {
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

const buscarMedicamentoId = async (id) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM medicamentos WHERE id = ?;',
            [id]
        );
        return query;
    } catch (error) {
        console.error('Erro ao buscar medicamento:', error);
        throw new Error('Falha ao buscar medicamento');
    }
};

const listarMedicamentosPet = async (id_pet) => {
    try {
        const query = await connection.execute(
            'SELECT * FROM medicamentos WHERE id_pet = ?;',
            [id_pet]
        );
        return query;
    } catch (error) {
        console.error('Erro ao listar medicamentos do pet:', error);
        throw new Error('Falha ao listar medicamentos');
    }
};

const atualizarMedicamento = async (id, id_pet, nome, veterinario, data, dose, motivo) => {
    try {
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

const listarMedicamentos = async () => {
    try {
        const query = await connection.execute(
            'SELECT * FROM medicamentos;'
        );
        return query;
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