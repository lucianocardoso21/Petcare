document.addEventListener("DOMContentLoaded", function () {
    // Botão voltar
    document.getElementById('btn-voltar').addEventListener('click', function () {
        window.close();
    });

    // Função para formatar datas
    function formatDate(dateString) {
        if (!dateString) return "Não informada";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return dateString;
        }
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (!petId) {
        showError('Pet não encontrado');
        return;
    }

    // Elementos do formulário de edição
    const btnEditarPet = document.querySelector('#btn-editar-pet');
    const editPetForm = new bootstrap.Modal(document.querySelector('#editPetForm'));
    const btnSaveForm = document.querySelector('#btn-save-pet');

    // Função para carregar dados do pet para edição
    async function loadPetDataForEdit(petId) {
        try {
            const response = await fetch(`http://localhost:1337/pets/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erro ao carregar dados do pet');
            
            const [petData] = await response.json();
            
            // Preencher o formulário com os dados do pet
            document.getElementById('edit-pet-id').value = petId;
            document.getElementById('edit-name').value = petData.nome || '';
            document.getElementById('edit-species').value = petData.especie || 'Canino';
            document.getElementById('edit-breed').value = petData.raca || '';
            document.getElementById('edit-birthdate').value = petData.data_nasc ? petData.data_nasc.split('T')[0] : '';
            document.getElementById('edit-weight').value = petData.peso || '';
            document.getElementById('edit-health-status').value = petData.cond_saude || '';
            
        } catch (error) {
            console.error('Erro ao carregar dados do pet:', error);
            alert('Erro ao carregar dados do pet para edição');
        }
    }

    // Abrir formulário de edição
    btnEditarPet.addEventListener('click', async () => {
        editPetForm.show();
        await loadPetDataForEdit(petId);
    });

    // Salvar edição
    btnSaveForm.addEventListener('click', async () => {
        const petId = document.getElementById("edit-pet-id").value;
        
        if (!petId) {
            alert('Erro: Pet não encontrado!');
            return;
        }
        
        const petData = {
            nome: document.getElementById("edit-name").value,
            especie: document.getElementById("edit-species").value,
            raca: document.getElementById("edit-breed").value,
            data_nasc: document.getElementById("edit-birthdate").value,
            peso: document.getElementById("edit-weight").value,
            cond_saude: document.getElementById("edit-health-status").value
        };

        // Validação básica
        if (!petData.nome || !petData.especie) {
            alert('Nome e espécie são obrigatórios!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/pets/atualizar/${petId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(petData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar pet');
            }
            
            alert('Pet atualizado com sucesso!');
            editPetForm.hide();
            location.reload();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar alterações: ' + e.message);
        }
    });

    // Carregar detalhes do pet
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center my-4';
    loadingIndicator.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>';
    document.querySelector('.pet-details-container').prepend(loadingIndicator);

    fetch(`http://localhost:1337/pets/prop/${localStorage.getItem('cpf')}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar pets');
            return response.json();
        })
        .then(pets => {
            const pet = pets.find(p => p.id == petId);
            if (!pet) throw new Error('Pet não encontrado');

            document.getElementById('pet-name').textContent = pet.nome || 'Não informado';
            const petIcon = document.getElementById('pet-icon');
            petIcon.innerHTML = pet.especie.toLowerCase() === 'felino'
                ? '<i class="fas fa-cat fa-2x"></i>'
                : pet.especie.toLowerCase() === 'canino'
                    ? '<i class="fas fa-dog fa-2x"></i>'
                    : '<i class="fas fa-paw fa-2x"></i>';

            document.getElementById('pet-species').textContent = pet.especie || 'Não informado';
            document.getElementById('pet-breed').textContent = pet.raca || 'Não informado';
            document.getElementById('pet-age').textContent = pet.idade || 'Não informado';
            document.getElementById('pet-weight').textContent = pet.peso || 'Não informado';
            
            // Condição de saúde com formatação melhorada
            const healthStatus = document.getElementById('pet-health-status');
            healthStatus.textContent = pet.cond_saude || 'Não informada';
            healthStatus.style.fontSize = '1.1rem';
            healthStatus.style.whiteSpace = 'pre-wrap';

            return Promise.all([
                fetch(`http://localhost:1337/medicamentos/pet/${petId}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.ok ? res.json() : Promise.reject('Erro ao buscar medicamentos')).catch(() => []),
                fetch(`http://localhost:1337/vacinas/pet/${petId}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.ok ? res.json() : Promise.reject('Erro ao buscar vacinas')).catch(() => []),
                fetch(`http://localhost:1337/procedimentos/pet/${petId}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.ok ? res.json() : Promise.reject('Erro ao buscar procedimentos')).catch(() => [])
            ]);
        })
        .then(([medicamentos, vacinas, procedimentos]) => {
            fillSection('medications-list', medicamentos, 'medication', 'Nenhuma medicação registrada.', 'medicamentos');
            fillSection('vaccines-list', vacinas, 'vaccine', 'Nenhuma vacina registrada.', 'vacinas');
            fillSection('procedures-list', procedimentos, 'procedure', 'Nenhum procedimento registrado.', 'procedimentos');
        })
        .catch(error => {
            console.error('Erro:', error);
            showError(`Erro ao carregar detalhes do pet: ${error.message}`);
        })
        .finally(() => {
            loadingIndicator.remove();
        });

    // ... (restante das funções fillSection, deleteItem, openForm, getFormData, showError permanecem iguais)
    // ... (certifique-se de que todas as outras funções do seu código original estão aqui)
});

function fillSection(sectionId, items, itemType, emptyMessage, apiEndpoint) {
    // ... (implementação original)
}

function deleteItem(itemId, apiEndpoint) {
    // ... (implementação original)
}

function openForm(item, apiEndpoint) {
    // ... (implementação original)
}

function getFormData(apiEndpoint) {
    // ... (implementação original)
}

function showError(message) {
    // ... (implementação original)
}