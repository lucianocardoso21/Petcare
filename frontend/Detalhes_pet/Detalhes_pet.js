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
            let date;

            // Se já for um objeto Date
            if (dateTimeString instanceof Date) {
                date = dateTimeString;
            }
            // Formato ISO (2024-05-20T14:30:00Z)
            else if (dateTimeString.includes('T')) {
                date = new Date(dateTimeString);
            }
            // Formato SQL (2025-04-02 12:02:12)
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
            return dateTimeString; // Retorna o valor original em caso de erro
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
            document.getElementById('edit-status').checked = petData.status === 'ativo';

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
            cond_saude: document.getElementById("edit-health-status").value.trim(),
        };

        // Validação
        if (!petData.nome || !petData.especie) {
            alert('Nome e espécie são obrigatórios!');
            return false;
        }

        try {
            const response = await fetch(`http://localhost:1337/pets/atualizar/${petId}`, {
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

    // Adicione esta nova função no seu arquivo Detalhes_pet.js
    async function alterarStatusPet(petId) {
        try {
            const response = await fetch(`http://localhost:1337/pets/status/${petId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao alterar status do pet');
            }

            return true;
        } catch (e) {
            console.error(e);
            alert('Erro ao alterar status: ' + e.message);
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
        let modalId, formId, titleId;
        let isEditMode = item !== null;

        // Configurações específicas para cada tipo
        switch (apiEndpoint) {
            case 'medicamentos':
                modalId = '#medicationModal';
                formId = 'medicationForm';
                titleId = 'medicationModalTitle';
                break;
            case 'vacinas':
                modalId = '#vaccineModal';
                formId = 'vaccineForm';
                titleId = 'vaccineModalTitle';
                break;
            case 'procedimentos':
                modalId = '#procedureModal';
                formId = 'procedureForm';
                titleId = 'procedureModalTitle';
                break;
            default:
                console.error('Tipo de endpoint não suportado:', apiEndpoint);
                return;
        }

        const modal = new bootstrap.Modal(document.querySelector(modalId));
        const form = document.getElementById(formId);
        const title = document.getElementById(titleId);

        if (!modal || !form || !title) {
            console.error('Elementos do modal não encontrados para:', apiEndpoint);
            return;
        }

        // Configuração comum para todos os modais
        title.textContent = isEditMode ? `Editar ${getEndpointName(apiEndpoint)}` : `Adicionar ${getEndpointName(apiEndpoint)}`;
        form.reset();

        if (isEditMode) {
            // Preenche o formulário com os dados do item
            fillFormForEndpoint(apiEndpoint, form, item);
        } else {
            // Configura valores padrão para novo item
            setDefaultValuesForNewItem(apiEndpoint, form);
        }

        modal.show();
    }

    // Função auxiliar para obter o nome amigável do endpoint
    function getEndpointName(apiEndpoint) {
        const names = {
            'medicamentos': 'Medicação',
            'vacinas': 'Vacina',
            'procedimentos': 'Procedimento'
        };
        return names[apiEndpoint] || 'Item';
    }

    // Função para preencher o formulário com base no tipo de endpoint
    function fillFormForEndpoint(apiEndpoint, form, item) {
        switch (apiEndpoint) {
            case 'medicamentos':
                form.querySelector('#medication-id').value = item.id;
                form.querySelector('#medication-name').value = item.nome_medicamento || '';
                form.querySelector('#medication-dosage').value = item.dosagem || '';
                form.querySelector('#medication-frequency').value = item.frequencia || '';
                form.querySelector('#medication-start').value = item.data_inicio?.split('T')[0] || '';
                form.querySelector('#medication-end').value = item.data_fim?.split('T')[0] || '';
                form.querySelector('#medication-notes').value = item.observacoes || '';
                break;

            case 'vacinas':
                form.querySelector('#vaccine-id').value = item.id;
                form.querySelector('#vaccine-name').value = item.nome || '';
                form.querySelector('#vaccine-manufacturer').value = item.fabricante || '';
                form.querySelector('#vaccine-lot').value = item.lote || '';
                form.querySelector('#vaccine-validity').value = item.validade?.split('T')[0] || '';
                form.querySelector('#vaccine-application').value = item.data_aplicacao?.split('T')[0] || '';
                form.querySelector('#vaccine-next').value = item.prox_aplicacao?.split('T')[0] || '';
                form.querySelector('#vaccine-vet').value = item.veterinario || '';
                break;

            case 'procedimentos':
                form.querySelector('#procedure-id').value = item.id;
                form.querySelector('#procedure-type').value = item.tipo || '';
                form.querySelector('#procedure-date').value = item.data_procedimento?.split('T')[0] || '';
                form.querySelector('#procedure-description').value = item.descricao || '';
                form.querySelector('#procedure-vet').value = item.veterinario || '';
                break;
        }
    }

    // Função para definir valores padrão para novos itens
    function setDefaultValuesForNewItem(apiEndpoint, form) {
        const today = new Date().toISOString().split('T')[0];

        switch (apiEndpoint) {
            case 'medicamentos':
                form.querySelector('#medication-id').value = '';
                form.querySelector('#medication-start').value = today;
                break;

            case 'vacinas':
                form.querySelector('#vaccine-id').value = '';
                form.querySelector('#vaccine-application').value = today;
                break;

            case 'procedimentos':
                form.querySelector('#procedure-id').value = '';
                form.querySelector('#procedure-date').value = today;
                break;
        }
    }

    // CRUD MEDICAMENTOS
    async function saveMedication(petId, token) {
        // 1. Coleta e preparação dos dados
        const medicationData = {
            nome_medicamento: document.getElementById('medication-name').value.trim(),
            dosagem: document.getElementById('medication-dosage').value.trim(),
            frequencia: document.getElementById('medication-frequency').value.trim(),
            data_inicio: document.getElementById('medication-start').value,
            data_fim: document.getElementById('medication-end').value || null,
            observacoes: document.getElementById('medication-notes').value.trim() || null,
            id_pet: petId
        };

        // 2. Validação avançada dos campos
        const validationErrors = [];

        if (!medicationData.nome_medicamento) {
            validationErrors.push('Nome do medicamento é obrigatório');
        }

        if (!medicationData.dosagem) {
            validationErrors.push('Dosagem é obrigatória');
        }

        if (!medicationData.frequencia) {
            validationErrors.push('Frequência é obrigatória');
        }

        if (!medicationData.data_inicio) {
            validationErrors.push('Data de início é obrigatória');
        } else {
            // Validação da data (não pode ser no futuro)
            const startDate = new Date(medicationData.data_inicio);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate > today) {
                validationErrors.push('Data de início não pode ser no futuro');
            }

            // Validação se data de término é anterior à data de início
            if (medicationData.data_fim) {
                const endDate = new Date(medicationData.data_fim);
                if (endDate < startDate) {
                    validationErrors.push('Data de término não pode ser anterior à data de início');
                }
            }
        }

        if (validationErrors.length > 0) {
            alert('Erros de validação:\n\n' + validationErrors.join('\n'));
            return false;
        }

        // 3. Configuração da requisição
        try {
            const isEdit = document.getElementById('medication-id').value;
            // const endpoint = isEdit ? 'atualizar' : 'cadastrar';
            const url = isEdit
                ? `http://localhost:1337/medicamentos/${isEdit}`  // PATCH para editar
                : `http://localhost:1337/medicamentos`;           // POST para cadastrar

            const method = isEdit ? 'PATCH' : 'POST';
            console.log('Dados a serem enviados:', medicationData);

            // 4. Execução da requisição
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medicationData),
                timeout: 10000 // timeout simulado
            });

            // 5. Tratamento da resposta
            if (!response.ok) {
                let errorMessage = 'Erro ao salvar medicamento';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;

                    // Tratamento específico para erros conhecidos
                    if (response.status === 400) {
                        errorMessage = 'Dados inválidos: ' + (errorData.errors?.join(', ') || errorMessage);
                    } else if (response.status === 401) {
                        errorMessage = 'Não autorizado - faça login novamente';
                        localStorage.removeItem('authToken');
                        window.location.href = '/login.html';
                        return false;
                    } else if (response.status === 404) {
                        errorMessage = 'Recurso não encontrado';
                    }
                } catch (e) {
                    console.error('Erro ao processar resposta de erro:', e);
                }

                throw new Error(errorMessage);
            }

            // 6. Processamento da resposta de sucesso
            const responseData = await response.json();

            if (!responseData.success && responseData.message) {
                throw new Error(responseData.message);
            }

            // 7. Feedback visual para o usuário
            const successMessage = isEdit
                ? 'Medicamento atualizado com sucesso!'
                : 'Medicamento cadastrado com sucesso!';

            // Usando Toast ou notificação mais amigável (opcional)
            showNotification(successMessage, 'success');

            return true;

        } catch (error) {
            // 8. Tratamento de erros detalhado
            console.error('Erro completo:', error);

            let userErrorMessage = 'Erro ao salvar medicamento';

            if (error.name === 'AbortError') {
                userErrorMessage = 'Tempo de conexão esgotado. Verifique sua internet.';
            } else if (error.message.includes('Failed to fetch')) {
                userErrorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
            } else {
                userErrorMessage = error.message || userErrorMessage;
            }

            showNotification(userErrorMessage, 'error');
            return false;
        }
    }

    // Função auxiliar para mostrar notificações (opcional)
    function showNotification(message, type = 'info') {
        // Implementação básica - pode ser substituída por uma lib como Toastify
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // CRUD VACINAS
    async function saveVaccine(petId) {
        const vaccineData = {
            nome: document.getElementById('vaccine-name').value.trim(),
            fabricante: document.getElementById('vaccine-manufacturer').value.trim(),
            lote: document.getElementById('vaccine-lot').value.trim(),
            validade: document.getElementById('vaccine-validity').value,
            data_aplicacao: document.getElementById('vaccine-application').value,
            prox_aplicacao: document.getElementById('vaccine-next').value || null,
            veterinario: document.getElementById('vaccine-vet').value.trim(),
            id_pet: petId
        };

        // Validação
        if (!vaccineData.nome || !vaccineData.fabricante ||
            !vaccineData.lote || !vaccineData.validade ||
            !vaccineData.data_aplicacao || !vaccineData.prox_aplicacao ||
            !vaccineData.veterinario) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return false;
        }

        try {
            const vaccineId = document.getElementById('vaccine-id').value;
            const method = vaccineId ? 'PATCH' : 'POST';
            const url = vaccineId
                ? `http://localhost:1337/vacinas/${vaccineId}`
                : 'http://localhost:1337/vacinas';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vaccineData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar vacina');
            }

            return true;
        } catch (error) {
            console.error('Erro ao salvar vacina:', error);
            alert('Erro ao salvar vacina: ' + error.message);
            return false;
        }
    }

    async function saveProcedure(petId) {
        const procedureData = {
            tipo: document.getElementById('procedure-type').value.trim(),
            descricao: document.getElementById('procedure-description').value.trim(),
            data_procedimento: document.getElementById('procedure-date').value,
            veterinario: document.getElementById('procedure-vet').value.trim(),
            id_pet: petId
        };

        // Validação
        if (!procedureData.tipo || !procedureData.descricao || !procedureData.data_procedimento || !procedureData.veterinario) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return false;
        }

        try {
            const procedureId = document.getElementById('procedure-id').value;
            const method = procedureId ? 'PATCH' : 'POST';
            const url = procedureId
                ? `http://localhost:1337/procedimentos/${procedureId}`
                : 'http://localhost:1337/procedimentos';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(procedureData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar procedimento');
            }

            return true;
        } catch (error) {
            console.error('Erro ao salvar procedimento:', error);
            alert('Erro ao salvar procedimento: ' + error.message);
            return false;
        }
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
    btnVoltar.addEventListener('click', () => {
        window.location.href = '../Dash/Dash.html';
    });

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

    document.getElementById('edit-status').addEventListener('change', async (e) => {
        const success = await alterarStatusPet(petId);
        if (success) {
            // Atualiza visualmente sem recarregar a página
            const statusEl = document.getElementById('pet-status');
            if (statusEl) {
                const novoStatus = e.target.checked ? 'ativo' : 'inativo';
                statusEl.textContent = novoStatus.toUpperCase();
                statusEl.className = novoStatus === 'ativo' ? 'text-success fw-bold' : 'text-danger fw-bold';
            }

            // Mostra feedback ao usuário
            showNotification('Status atualizado com sucesso!', 'success');
        } else {
            // Reverte o checkbox em caso de erro
            e.target.checked = !e.target.checked;
        }
    });

    document.getElementById('btn-save-medication')?.addEventListener('click', async () => {
        const success = await saveMedication(petId);
        if (success) {
            bootstrap.Modal.getInstance('#medicationModal').hide();
            location.reload();
        }
    });

    document.getElementById('btn-save-vaccine')?.addEventListener('click', async () => {
        const success = await saveVaccine(petId);
        if (success) {
            bootstrap.Modal.getInstance('#vaccineModal').hide();
            location.reload();
        }
    });

    document.getElementById('btn-save-procedure')?.addEventListener('click', async () => {
        const success = await saveProcedure(petId);
        if (success) {
            bootstrap.Modal.getInstance('#procedureModal').hide();
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

            console.log('Dados completos do pet:', pet); // Debug
            console.log('Campo data_alteracao existe?', 'data_alteracao' in pet);
            console.log('Valor de data_alteracao:', pet.data_alteracao);


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
            setTextContent('pet-status', pet.status);
            const statusEl = document.getElementById('pet-status');
            if (statusEl) {
                const statusFormatado = pet.status.toUpperCase();
                statusEl.textContent = statusFormatado;
                statusEl.classList.add(pet.status === 'ativo' ? 'text-success' : 'text-danger');
                statusEl.classList.add('fw-bold');
            }


            const updateDateElement = document.getElementById('pet-update-date');
            if (updateDateElement) {
                console.log('Valor bruto de data_alteracao:', pet.data_alteracao); // Debug

                // Verifique todos os possíveis nomes de campo
                const rawDate = pet.data_alteracao || pet.updated_at || pet.data_atualizacao || pet.updatedAt;

                if (rawDate) {
                    try {
                        // Adicione um fallback para datas em formato SQL
                        let dateToFormat = rawDate;
                        if (typeof rawDate === 'string' && rawDate.includes(' ')) {
                            dateToFormat = rawDate.replace(' ', 'T');
                            if (!dateToFormat.includes('Z') && !dateToFormat.includes('+')) {
                                dateToFormat += 'Z'; // Assume UTC se não tiver timezone
                            }
                        }

                        const formattedDate = formatDateTime(dateToFormat);
                        updateDateElement.textContent = formattedDate;
                        updateDateElement.style.fontStyle = 'normal';

                        // Adicione um tooltip com a data completa
                        updateDateElement.title = `Atualizado em: ${formattedDate}`;
                    } catch (e) {
                        console.error('Erro ao formatar data:', e);
                        updateDateElement.textContent = rawDate; // Mostra o valor bruto se falhar
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