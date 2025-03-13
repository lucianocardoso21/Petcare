export function formularioCadastro() {
    const cadastroPetBtn = document.getElementById("cadastro-pet-btn");
    const mainContent = document.querySelector(".main-content");

    cadastroPetBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o comportamento padrão de clique

        // HTML do formulário de cadastro
        mainContent.innerHTML = `
            <h2>Cadastrar Pet</h2>
            <form id="pet-form">
                <div class="mb-3">
                    <label class="form-label">Nome do Pet:</label>
                    <input class="form-control" type="text" id="nome" placeholder="Nome do Pet" required>
                </div>
                <div class="border p-3 rounded-lg mb-3">
                    <p class="font-semibold mb-2">Espécie:</p>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="especie" id="canino" required>
                        <label class="form-check-label" for="canino">Canino</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="especie" id="felino" required>
                        <label class="form-check-label" for="felino">Felino</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="especie" id="outro" required>
                        <label class="form-check-label" for="outro">Outro</label>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Raça:</label>
                    <input class="form-control" type="text" id="raca" placeholder="Raça" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Data de Nascimento:</label>
                    <input class="form-control" type="date" id="data_nasc" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Peso (kg):</label>
                    <input class="form-control" type="number" id="peso" placeholder="Peso" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Condição de Saúde:</label>
                    <textarea class="form-control" type="text" id="cond_saude" placeholder="Condição de Saúde" required></textarea>
                </div>
                <button id="btnFormCadPet" class="botao w-100" type="submit">Cadastrar</button>
            </form>
        `;

        // Após carregar o formulário, configurar o evento de submit
        const petForm = document.getElementById("pet-form");
        petForm.addEventListener("submit", function (submitEvent) {
            submitEvent.preventDefault(); // Impede o comportamento padrão de envio do formulário

            // Coletar os dados do formulário
            const nomePet = document.getElementById("nome").value;
            const especie = document.querySelector('input[name="especie"]:checked')?.id;
            const raca = document.getElementById("raca").value;
            const dataNasc = document.getElementById("data_nasc").value;
            const peso = document.getElementById("peso").value;
            const condSaude = document.getElementById("cond_saude").value;

            // Verificar se todos os campos foram preenchidos
            if (!nomePet || !especie || !raca || !dataNasc || !peso || !condSaude) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            // Capturar o CPF do proprietário (assumindo que está armazenado no localStorage após login)
            const cpfProp = localStorage.getItem("cpf"); 

            // Preparar os dados do pet para envio ao backend
            const petData = {
                nome: nomePet,
                cpf_prop: cpfProp,
                especie: especie,
                raca: raca,
                data_nasc: dataNasc,
                peso: peso,
                cond_saude: condSaude,
                status: 'ativo',
                data_alteracao: new Date().toISOString()
            };

            // Enviar os dados ao servidor via fetch
            fetch('/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Pet cadastrado com sucesso!');
                    // Você pode limpar o formulário ou redirecionar o usuário
                    mainContent.innerHTML = ''; // Limpar o conteúdo da tela
                } else {
                    alert('Erro ao cadastrar o pet. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro ao cadastrar pet:', error);
                alert('Ocorreu um erro. Tente novamente mais tarde.');
            });
        });
    });
}
