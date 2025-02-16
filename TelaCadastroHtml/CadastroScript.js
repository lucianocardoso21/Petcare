document.getElementById('formCadastroCliente').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Pegando os dados do formulário
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const nome = document.getElementById('nome').value;
    const celular = document.getElementById('celular').value;
    const endereco = document.getElementById('endereco').value;

    try {
        // Enviando os dados para a API
        const response = await axios.post('http://localhost:1337/clientes', {
            cpf,
            senha,
            nome,
            celular,
            endereco
        });

        // Mostrando feedback de sucesso
        document.getElementById('feedback').textContent = 'Cadastro realizado com sucesso!';
        document.getElementById('formCadastroCliente').reset();

    } catch (error) {
        // Caso ocorra algum erro
        document.getElementById('feedback').textContent = 'Erro ao cadastrar cliente: ' + error.message;
    }
});