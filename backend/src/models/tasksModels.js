const connection = require('./connection');

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
const excluirCliente = async(cpf)=>{
    const query = await connection.execute(
        'DELETE FROM clientes WHERE cpf = ?;',
        [cpf]
    );
    return query;
};
const listarClientes = async ()=>{
    const query = await connection.execute(
        'SELECT * FROM clientes;'
    );
    return query;
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

module.exports = {
    cadastrarCliente,
    buscarClienteCpf,
    atualizarCliente,
    excluirCliente,
    listarClientes,
    verificarClienteExistente,
    atualizarCampoCliente,
    buscarClienteNome,
    contarClientes
};