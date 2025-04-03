document.addEventListener("DOMContentLoaded", function () {
    // Elementos principais
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Obter ID do pet da URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    if (!petId) {
        showError('Pet não encontrado');
        return;
    }

    // Elementos do DOM
    const btnVoltar = document.getElementById('btn-voltar');
    const btnEditarPet = document.getElementById('btn-editar-pet');
    const editPetForm = new bootstrap.Modal('#editPetForm');
    const btnSaveForm = document.getElementById('btn-save-pet');

    // Funções auxiliares
    function formatDate(dateString) {
        if (!dateString) return "Não informada";
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch (e) {
            console.error("Erro ao formatar data:", e);
            return dateString;
        }
    }

    function formatDateTime(dateTimeString) {
        if (!dateTimeString) return null;
    
        try {
            // Converter para Date (tratando múltiplos formatos)
            let date;
            
            // Formato ISO (2024-05-20T14:30:00Z)
            if (dateTimeString.includes('T')) {
                date = new Date(dateTimeString);
            } 
            // Formato SQL (2024-05-20 14:30:00)
            else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTimeString)) {
                date = new Date(dateTimeString.replace(' ', 'T') + 'Z');
            }
            // Timestamp UNIX
            else if (/^\d+$/.test(dateTimeString)) {
                date = new Date(parseInt(dateTimeString));
            }
            
            if (!date || isNaN(date.getTime())) {
                throw new Error('Formato de data não reconhecido');
            }
    
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
            });
        } catch (e) {
            console.error("Erro ao formatar data:", dateTimeString, e);
            throw e; // Re-lança o erro para ser tratado externamente
        }
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        document.querySelector('.pet-details-container').prepend(errorDiv);
    }

    // Carregar dados do pet para edição
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

            // Preencher formulário de edição
            document.getElementById('edit-pet-id').value = petId;
            document.getElementById('edit-name').value = petData.nome || '';
            document.getElementById('edit-species').value = petData.especie || 'Canino';
            document.getElementById('edit-breed').value = petData.raca || '';
            document.getElementById('edit-birthdate').value = petData.data_nasc?.split('T')[0] || '';
            document.getElementById('edit-weight').value = petData.peso || '';
            document.getElementById('edit-health-status').value = petData.cond_saude || '';

        } catch (error) {
            console.error('Erro ao carregar dados do pet:', error);
            alert('Erro ao carregar dados do pet para edição');
        }
    }

    // Salvar edição do pet
    async function savePetData(petId) {
        const petData = {
            nome: document.getElementById("edit-name").value.trim(),
            especie: document.getElementById("edit-species").value,
            raca: document.getElementById("edit-breed").value.trim(),
            data_nasc: document.getElementById("edit-birthdate").value,
            peso: document.getElementById("edit-weight").value,
            cond_saude: document.getElementById("edit-health-status").value.trim()
        };

        // Validação
        if (!petData.nome || !petData.especie) {
            alert('Nome e espécie são obrigatórios!');
            return false;
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

            return true;
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar alterações: ' + e.message);
            return false;
        }
    }

    // Preencher seção de itens (medicamentos, vacinas, procedimentos)
    function fillSection(sectionId, items, emptyMessage, apiEndpoint) {
        const section = document.getElementById(sectionId);
        if (!section) {
            console.error(`Elemento #${sectionId} não encontrado`);
            return;
        }

        section.innerHTML = '';

        // Botão Adicionar
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-success mb-3';
        addButton.innerHTML = '<i class="fas fa-plus me-2"></i>Adicionar';
        addButton.onclick = () => openForm(null, apiEndpoint);
        section.appendChild(addButton);

        // Mensagem se vazio
        if (!items || items.length === 0) {
            const emptyText = document.createElement('div');
            emptyText.className = 'alert alert-info';
            emptyText.textContent = emptyMessage;
            section.appendChild(emptyText);
            return;
        }

        // Itens
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'card mb-3';
            itemDiv.innerHTML = generateItemHTML(item, apiEndpoint);

            // Botões de ação
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'card-footer bg-white d-flex justify-content-end gap-2';

            const editButton = document.createElement('button');
            editButton.className = 'btn btn-sm btn-warning';
            editButton.innerHTML = '<i class="fas fa-edit me-1"></i>Editar';
            editButton.onclick = () => openForm(item, apiEndpoint);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-sm btn-danger';
            deleteButton.innerHTML = '<i class="fas fa-trash me-1"></i>Remover';
            deleteButton.onclick = () => deleteItem(item.id, apiEndpoint);

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            itemDiv.appendChild(buttonContainer);
            section.appendChild(itemDiv);
        });
    }

    function generateItemHTML(item, apiEndpoint) {
        let html = '<div class="card-body">';

        if (apiEndpoint === 'medicamentos') {
            html += `
                <h5 class="card-title">${item.nome_medicamento || 'Sem nome'}</h5>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Dosagem:</strong> ${item.dosagem || 'Não informada'}</p>
                        <p class="mb-1"><strong>Frequência:</strong> ${item.frequencia || 'Não informada'}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Início:</strong> ${formatDate(item.data_inicio)}</p>
                        <p class="mb-1"><strong>Fim:</strong> ${formatDate(item.data_fim) || 'Não informado'}</p>
                    </div>
                </div>
            `;
        } else if (apiEndpoint === 'vacinas') {
            html += `
                <h5 class="card-title">${item.nome || 'Vacina sem nome'}</h5>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Fabricante:</strong> ${item.fabricante || 'Não informado'}</p>
                        <p class="mb-1"><strong>Lote:</strong> ${item.lote || 'Não informado'}</p>
                        <p class="mb-1"><strong>Validade:</strong> ${formatDate(item.validade)}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Aplicação:</strong> ${formatDate(item.data_aplicacao)}</p>
                        <p class="mb-1"><strong>Próxima dose:</strong> ${formatDate(item.prox_aplicacao) || 'Não informada'}</p>
                        <p class="mb-1"><strong>Veterinário:</strong> ${item.veterinario || 'Não informado'}</p>
                    </div>
                </div>
            `;
        } else if (apiEndpoint === 'procedimentos') {
            html += `
                <h5 class="card-title">${item.tipo || 'Procedimento'}</h5>
                <p class="mb-2"><strong>Descrição:</strong> ${item.descricao || 'Sem descrição'}</p>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Data:</strong> ${formatDate(item.data_procedimento)}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>Veterinário:</strong> ${item.veterinario || 'Não informado'}</p>
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    // Abrir formulário para adicionar/editar item
    function openForm(item, apiEndpoint) {
        // Implementação do formulário modal para cada tipo de item
        // (Mantido genérico para o exemplo)
        alert(`Abrir formulário para ${apiEndpoint}: ${item ? 'Editar' : 'Novo'}`);
    }

    // Excluir item
    async function deleteItem(itemId, apiEndpoint) {
        if (!confirm('Tem certeza que deseja remover este item?')) return;

        try {
            const response = await fetch(`http://localhost:1337/${apiEndpoint}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Erro ao remover item');

            alert('Item removido com sucesso!');
            location.reload();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao remover item: ' + error.message);
        }
    }

    // Event Listeners
    btnVoltar.addEventListener('click', () => window.close());

    btnEditarPet.addEventListener('click', async () => {
        await loadPetDataForEdit(petId);
        editPetForm.show();
    });

    btnSaveForm.addEventListener('click', async () => {
        const success = await savePetData(petId);
        if (success) {
            editPetForm.hide();
            location.reload();
        }
    });

    // Carregar dados iniciais do pet
    async function loadPetData() {
        try {
            // Mostrar loading
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'text-center my-4';
            loadingIndicator.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>';
            document.querySelector('.pet-details-container').prepend(loadingIndicator);

            // Verificar se petId existe
            if (!petId) {
                throw new Error('ID do pet não encontrado na URL');
            }

            // Carregar dados do pet
            const petsResponse = await fetch(`http://localhost:1337/pets/prop/${localStorage.getItem('cpf')}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!petsResponse.ok) {
                throw new Error(`Erro ${petsResponse.status}: ${petsResponse.statusText}`);
            }

            const pets = await petsResponse.json();
            const pet = pets.find(p => p.id == petId);

            if (!pet) {
                throw new Error(`Pet com ID ${petId} não encontrado`);
            }

            console.log('Dados do pet recebidos:', pet); // Debug

            // Preencher informações básicas com verificação
            const setTextContent = (id, value, defaultValue = 'Não informado') => {
                const element = document.getElementById(id);
                if (element) element.textContent = value || defaultValue;
            };

            setTextContent('pet-name', pet.nome);
            setTextContent('pet-species', pet.especie);
            setTextContent('pet-breed', pet.raca);
            setTextContent('pet-age', pet.idade);
            setTextContent('pet-weight', pet.peso);
            setTextContent('pet-health-status', pet.cond_saude, 'Não informada');

            // Data de atualização formatada
            // Na função loadPetData(), substitua esta parte:
            const updateDateElement = document.getElementById('pet-update-date');
            if (updateDateElement) {
                console.log('Valor bruto de data_alteracao:', pet.data_alteracao); // Debug

                // Verifique todos os possíveis nomes de campo
                const rawDate = pet.data_alteracao || pet.updated_at || pet.data_atualizacao;

                if (rawDate) {
                    try {
                        const formattedDate = formatDateTime(rawDate);
                        updateDateElement.textContent = formattedDate;
                        updateDateElement.style.fontStyle = 'normal';

                        // Adicione um tooltip com a data completa
                        updateDateElement.title = `Atualizado em: ${formattedDate}`;
                    } catch (e) {
                        console.error('Erro ao formatar data:', e);
                        updateDateElement.textContent = "Data inválida";
                        updateDateElement.style.fontStyle = 'italic';
                    }
                } else {
                    updateDateElement.textContent = "Não registrada";
                    updateDateElement.style.fontStyle = 'italic';
                }
            }

            // Ícone conforme espécie
            const petIcon = document.getElementById('pet-icon');
            if (petIcon) {
                petIcon.innerHTML = pet.especie?.toLowerCase() === 'felino'
                    ? '<i class="fas fa-cat fa-2x"></i>'
                    : pet.especie?.toLowerCase() === 'canino'
                        ? '<i class="fas fa-dog fa-2x"></i>'
                        : '<i class="fas fa-paw fa-2x"></i>';
            }

            // Carregar itens relacionados com tratamento de erro
            const loadPetItems = async (endpoint) => {
                try {
                    const response = await fetch(`http://localhost:1337/${endpoint}/pet/${petId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    return response.ok ? await response.json() : [];
                } catch (error) {
                    console.error(`Erro ao carregar ${endpoint}:`, error);
                    return [];
                }
            };

            const [medicamentos, vacinas, procedimentos] = await Promise.all([
                loadPetItems('medicamentos'),
                loadPetItems('vacinas'),
                loadPetItems('procedimentos')
            ]);

            // Preencher as abas com verificação
            const fillSectionSafe = (sectionId, items, emptyMessage, apiEndpoint) => {
                const section = document.getElementById(sectionId);
                if (section) fillSection(sectionId, items, emptyMessage, apiEndpoint);
            };

            fillSectionSafe('medications-list', medicamentos, 'Nenhuma medicação registrada.', 'medicamentos');
            fillSectionSafe('vaccines-list', vacinas, 'Nenhuma vacina registrada.', 'vacinas');
            fillSectionSafe('procedures-list', procedimentos, 'Nenhum procedimento registrado.', 'procedimentos');

        } catch (error) {
            console.error('Erro ao carregar dados do pet:', error);
            showError(`Falha ao carregar dados: ${error.message}`);

            // Opcional: Redirecionar após 3 segundos se for erro grave
            if (error.message.includes('não encontrado')) {
                setTimeout(() => window.location.href = '/pets.html', 3000);
            }
        } finally {
            // Remover loading de forma segura
            const loadings = document.querySelectorAll('.spinner-border');
            loadings.forEach(loading => loading.remove());
        }
    }

    // Iniciar
    loadPetData();
});