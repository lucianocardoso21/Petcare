const connection = require('./connection');

/** TABELA CLIENTES */
const cadastrarCliente = async (cpf, senha, nome, celular, endereco)=>{
    const query = await connection.execute(
        'INSERT INTO clientes(cpf, senha, nome, celular, endereco, data_entrada) VALUES (?, ?, ?, ?, ?, NOW());',
        [cpf, senha, nome, celular, endereco]
    );
    return query;
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
    if (cliente.lenght === 0){
        throw new Error('Cliente não encontrado');
    }
    const novoStatus = cliente[0].status === 'ativo'?'inativo':'ativo';
    const query = await connection.execute(
        'UPDATE clientes SET status =? WHERE cpf =?;',
        [novoStatus, cpf]
    );
    return query;
};
const listarClientes = async (status)=>{
    let query;
    let param = [];
    if (status === 'inativo'){
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
const listarPetCpfProp = async (cpf_prop, status)=>{
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
    const query = await connection.execute(
        'UPDATE  pets SET status="inativo" WHERE id = ?;',
        [id]
    );
    return query;
};
const listarPet = async (cpf_prop, status)=>{
    let query;
    let param = [cpf_prop];
    if (status === 'todos'){
        query = 'SELECT * FROM pets WHERE cpf_prop =?;';
    }else{
        query = 'SELECT * FROM pets WHERE cpf_prop =? AND status =?;';
        param.push(status);
    }
    const result = await connection.execute(query, param);
    return result;
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
};