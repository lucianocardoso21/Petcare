document.getElementById('formCadastroCliente').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Pegando os dados do formulário
    const cpfInput = document.getElementById('cpf');
    const senha = document.getElementById('senha').value;
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const celular = document.getElementById('celular').value;
    const endereco = document.getElementById('endereco').value;

    // Limpando o CPF (removendo espaços, pontos e traços)
    cpfInput.value = cpfInput.value.replace(/[\s.-]/g, '');
    const cpf = cpfInput.value;

    try {
        // Enviando os dados para a API
        const response = await axios.post('http://localhost:1337/clientes', {
            cpf,
            senha,
            nome,
            sobrenome,
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

window.onload = function() {
    window.scrollTo(0, 0); // Mover a rolagem para o topo
};
