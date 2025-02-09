const connection = require('./connection');

const buscarCliente = async ()=>{
    const tarefa = await connection.execute('SELECT * FROM cliente WHERE cpf=?;');
    return tarefa;
};

module.exports = {
    buscarCliente
};