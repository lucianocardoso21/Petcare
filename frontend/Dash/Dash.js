document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Buscar dados do cliente
    // console.log('Fazendo requisição para /auth');
    fetch('http://localhost:1337/auth', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            // console.log('Resposta da requisição /auth recebida', response);

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do cliente');
            }
            return response.json();
        })
        .then(cliente => {
            // Log para verificar os dados retornados pela API de autenticação
            // console.log('Cliente carregado:', cliente);  // Verifique o conteúdo da resposta da API

            // Verifique especificamente o CPF do cliente
            // console.log('CPF do cliente:', cliente.cpf);  // Verifique se o CPF está presente e correto


            document.getElementById('client-name').textContent = cliente.nome;

            // Buscar pets do cliente pelo CPF
            fetch(`http://localhost:1337/pets/prop/${cliente.cpf}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar pets do cliente');
                    }
                    return response.json();
                })
                .then(pets => {
                    const petsList = document.getElementById('pets-list');
                    petsList.innerHTML = '';

                    if (pets.length === 0) {
                        petsList.innerHTML = '<p>Você não possui pets cadastrados.</p>';
                    } else {
                        console.log('Resposta da API:', pets);
                        pets.forEach(pet => {
                            const petCard = document.createElement('div');
                            petCard.classList.add('card');
                            let icon;
                            if (pet.especie.toLowerCase() === 'felino') {
                                icon = '<i class="fas fa-cat"></i>'; // Ícone de gato
                            } else if (pet.especie.toLowerCase() === 'canino') {
                                icon = '<i class="fas fa-dog"></i>'; // Ícone de cachorro
                            } else {
                                icon = '<i class="fas fa-paw"></i>'; // Ícone genérico de animal
                            }
                            petCard.innerHTML = `
                        <h3>${pet.nome} ${icon}</h3>
                        <p>Espécie: ${pet.especie}</p>
                        <p>Raça: ${pet.raca}</p>
                        <p>Idade: ${pet.idade}</p>
                    `;
                            petsList.appendChild(petCard);
                        });
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar pets:', error);
                    document.getElementById('pets-list').innerHTML = '<p>Erro ao carregar pets.</p>';
                });

        })
        .catch(error => {
            console.error('Erro ao carregar dados do cliente:', error);
            window.location.href = '/login.html';
        });
});    

document.addEventListener("DOMContentLoaded", function () {
    const cadastroPetBtn = document.getElementById("cadastro-pet-btn");
    const mainContent = document.querySelector(".main-content");

    cadastroPetBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o comportamento padrão do link

        // HTML do formulário de cadastro
        mainContent.innerHTML = `
            <h2>Cadastrar Pet</h2>
            <form id="pet-form">
                <div class="mb-3">
                    <label class="form-label">Nome do Pet:</label>
                    <input class="form-control" type="text" id="nome" placeholder="Nome do Pet" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Proprietário:</label>
                    <input class="form-control" type="text" id="proprietario" placeholder="Nome do Proprietário" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">CPF:</label>
                    <input class="form-control" type="text" id="cpf_prop" placeholder="CPF do Proprietário" required>
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
                <button class="botao w-100" type="submit">Cadastrar</button>
            </form>
        `;
    });
});
