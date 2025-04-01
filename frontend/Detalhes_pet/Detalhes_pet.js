document.addEventListener("DOMContentLoaded", function () {
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
    .then(response => response.ok ? response.json() : Promise.reject('Erro ao buscar pets'))
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
        
        return Promise.all([
            fetch(`http://localhost:1337/medicamentos/pet/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }).then(res => {
                if (!res.ok) throw new Error('Erro ao buscar medicamentos');
                return res.json();
            }).catch(() => []),

            fetch(`http://localhost:1337/vacinas/pet/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }).then(res => {
                if (!res.ok) throw new Error('Erro ao buscar vacinas');
                return res.json();
            }).catch(() => []),

            fetch(`http://localhost:1337/procedimentos/pet/${petId}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }).then(res => {
                if (!res.ok) throw new Error('Erro ao buscar procedimentos');
                return res.json();
            }).catch(() => [])
        ]);
    })
    .then(([medicamentos, vacinas, procedimentos]) => {
        console.log('Medicamentos:', medicamentos);
        console.log('Vacinas:', vacinas);
        console.log('Procedimentos:', procedimentos);
        
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

    function fillSection(sectionId, items, itemType, emptyMessage, apiEndpoint) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';

        // Botão de adicionar
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-success mb-3';
        addButton.textContent = 'Adicionar';
        addButton.onclick = () => openForm(null, apiEndpoint);
        section.appendChild(addButton);

        if (items.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.textContent = emptyMessage;
            section.appendChild(emptyText);
            return;
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'card p-3 mb-2';
            
            if (apiEndpoint === 'medicamentos') {
                itemDiv.innerHTML = `
                    <strong>${item.nome_medicamento || 'Sem nome'}</strong><br>
                    <small>Dosagem: ${item.dosagem || 'Não informada'}</small><br>
                    <small>Frequência: ${item.frequencia || 'Não informada'}</small>
                `;
            } else if (apiEndpoint === 'vacinas') {
                itemDiv.innerHTML = `
                    <strong>${item.nome || 'Sem nome'}</strong><br>
                    <small>Fabricante: ${item.fabricante || 'Não informado'}</small><br>
                    <small>Próxima dose: ${item.prox_aplicacao || 'Não informada'}</small>
                `;
            } else if (apiEndpoint === 'procedimentos') {
                itemDiv.innerHTML = `
                    <strong>${item.tipo || 'Sem tipo'}</strong><br>
                    <small>${item.descricao || 'Sem descrição'}</small>
                `;
            }

            const editButton = document.createElement('button');
            editButton.id = 'btn-editar';
            editButton.className = 'btn btn-warning btn-sm mt-2';
            editButton.textContent = 'Editar';
            editButton.onclick = () => openForm(item, apiEndpoint);
            itemDiv.appendChild(editButton);

            section.appendChild(itemDiv);
        });
    }

    function openForm(item, apiEndpoint) {
        let formHtml = '';
        if (apiEndpoint === 'vacinas') {
            formHtml = `
                <div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${item ? 'Editar' : 'Adicionar'} Vacina</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="form-label">Nome:</label>
                                    <input type="text" id="form-name" class="form-control" value="${item ? item.nome : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Fabricante:</label>
                                    <input type="text" id="form-fabricante" class="form-control" value="${item ? item.fabricante : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Lote:</label>
                                    <input type="text" id="form-lote" class="form-control" value="${item ? item.lote : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Validade:</label>
                                    <input type="date" id="form-validade" class="form-control" value="${item ? item.validade : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Data de Aplicação:</label>
                                    <input type="date" id="form-data_aplicacao" class="form-control" value="${item ? item.data_aplicacao : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Veterinário:</label>
                                    <input type="text" id="form-veterinario" class="form-control" value="${item ? item.veterinario : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Próxima Aplicação:</label>
                                    <input type="date" id="form-prox_aplicacao" class="form-control" value="${item ? item.prox_aplicacao : ''}" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="saveButton">${item ? 'Salvar' : 'Adicionar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (apiEndpoint === 'medicamentos') {
            formHtml = `
                <div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${item ? 'Editar' : 'Adicionar'} Medicamento</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="form-label">Nome do Medicamento:</label>
                                    <input type="text" id="form-nome_medicamento" class="form-control" value="${item ? item.nome_medicamento : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Dosagem:</label>
                                    <input type="text" id="form-dosagem" class="form-control" value="${item ? item.dosagem : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Frequência:</label>
                                    <input type="text" id="form-frequencia" class="form-control" value="${item ? item.frequencia : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Data de Início:</label>
                                    <input type="date" id="form-data_inicio" class="form-control" value="${item ? item.data_inicio : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Data de Fim:</label>
                                    <input type="date" id="form-data_fim" class="form-control" value="${item ? item.data_fim : ''}">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="saveButton">${item ? 'Salvar' : 'Adicionar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (apiEndpoint === 'procedimentos') {
            formHtml = `
                <div class="modal fade" id="modalForm" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${item ? 'Editar' : 'Adicionar'} Procedimento</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="form-label">Tipo:</label>
                                    <input type="text" id="form-tipo" class="form-control" value="${item ? item.tipo : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descrição:</label>
                                    <textarea id="form-descricao" class="form-control" required>${item ? item.descricao : ''}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Data do Procedimento:</label>
                                    <input type="date" id="form-data_procedimento" class="form-control" value="${item ? item.data_procedimento : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Veterinário:</label>
                                    <input type="text" id="form-veterinario" class="form-control" value="${item ? item.veterinario : ''}" required>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="saveButton">${item ? 'Salvar' : 'Adicionar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = formHtml;
        document.body.appendChild(modalContainer);
        const modal = new bootstrap.Modal(document.getElementById('modalForm'));
        modal.show();

        document.getElementById('saveButton').addEventListener('click', () => {
            const formData = getFormData(apiEndpoint);
            formData.pet_id = petId;
            
            const method = item ? 'PATCH' : 'POST';
            const url = item ? `http://localhost:1337/${apiEndpoint}/${item.id}` : `http://localhost:1337/${apiEndpoint}`;

            console.log('Enviando dados para:', url, formData);

            fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.message || 'Erro na requisição') });
                }
                return response.json();
            })
            .then(() => {
                alert(item ? 'Atualizado com sucesso!' : 'Adicionado com sucesso!');
                modal.hide();
                location.reload();
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao salvar: ' + error.message);
            })
            .finally(() => {
                document.body.removeChild(modalContainer);
            });
        });

        document.getElementById('modalForm').addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modalContainer);
        });
    }

    function getFormData(apiEndpoint) {
        const data = {};
        if (apiEndpoint === 'vacinas') {
            data.nome = document.getElementById('form-name').value;
            data.fabricante = document.getElementById('form-fabricante').value;
            data.lote = document.getElementById('form-lote').value;
            data.validade = document.getElementById('form-validade').value;
            data.data_aplicacao = document.getElementById('form-data_aplicacao').value;
            data.veterinario = document.getElementById('form-veterinario').value;
            data.prox_aplicacao = document.getElementById('form-prox_aplicacao').value;
        } else if (apiEndpoint === 'medicamentos') {
            data.nome_medicamento = document.getElementById('form-nome_medicamento').value;
            data.dosagem = document.getElementById('form-dosagem').value;
            data.frequencia = document.getElementById('form-frequencia').value;
            data.data_inicio = document.getElementById('form-data_inicio').value;
            data.data_fim = document.getElementById('form-data_fim').value || null;
        } else if (apiEndpoint === 'procedimentos') {
            data.tipo = document.getElementById('form-tipo').value;
            data.descricao = document.getElementById('form-descricao').value;
            data.data_procedimento = document.getElementById('form-data_procedimento').value;
            data.veterinario = document.getElementById('form-veterinario').value;
        }
        return data;
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = message;
        document.querySelector('.pet-details-container').appendChild(errorDiv);
    }
});