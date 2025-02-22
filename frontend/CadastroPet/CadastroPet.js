// CadastroPet.js
document.addEventListener("DOMContentLoaded", function () {
    const petForm = document.getElementById("pet-form");
    
    if (petForm) {
        petForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Evita o envio tradicional do formulário
            // Obtém os valores dos campos e faz o processamento
        });
    } else {
        console.error("Formulário de pet não encontrado.");
    }

    petForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita o envio tradicional do formulário
        
        // Obtém os valores dos campos do formulário
        const nome = document.getElementById("nome").value;
        const proprietario = document.getElementById("proprietario").value;
        const cpf_prop = document.getElementById("cpf_prop").value;
        const especie = document.querySelector('input[name="especie"]:checked').value;
        const raca = document.getElementById("raca").value;
        const data_nasc = document.getElementById("data_nasc").value;
        const peso = document.getElementById("peso").value;
        const cond_saude = document.getElementById("cond_saude").value;

        // Obtendo o token do localStorage
        const token = localStorage.getItem('authToken');

        // Fazendo a requisição POST para cadastrar o pet
        fetch('http://localhost:1337/pets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                cpf_prop,
                proprietario,
                especie,
                raca,
                data_nasc,
                peso,
                cond_saude
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar o pet');
            }
            return response.json();
        })
        .then(data => {
            // Resposta da API - Pet cadastrado com sucesso
            alert('Pet cadastrado com sucesso!');
            // Você pode redirecionar ou atualizar a tela conforme necessário
            // Exemplo: window.location.href = '/pets';
        })
        .catch(error => {
            console.error('Erro ao cadastrar pet:', error);
            alert('Erro ao cadastrar o pet');
        });
    });
});
