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

    // Elementos da página
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center my-4';
    loadingIndicator.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>';
    document.querySelector('.pet-details-container').prepend(loadingIndicator);

    // Buscar informações do pet - usando a mesma URL do dash.js para consistência
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
        console.log('Todos os pets:', pets);
        
        // Encontrar o pet específico pelo ID
        const pet = pets.find(p => p.id == petId);
        
        if (!pet) {
            throw new Error('Pet não encontrado');
        }

        console.log('Pet encontrado:', pet);
        
        // Preencher informações básicas - exatamente como no dash.js
        document.getElementById('pet-name').textContent = pet.nome || 'Não informado';
        
        // Ícone (mesma lógica do dash.js)
        const petIcon = document.getElementById('pet-icon');
        const especie = (pet.especie || '').toString().toLowerCase();
        
        if (especie === 'felino') {
            petIcon.innerHTML = '<i class="fas fa-cat fa-2x"></i>';
        } else if (especie === 'canino') {
            petIcon.innerHTML = '<i class="fas fa-dog fa-2x"></i>';
        } else {
            petIcon.innerHTML = '<i class="fas fa-paw fa-2x"></i>';
        }
        
        // Campos básicos (mesma estrutura do dash.js)
        document.getElementById('pet-species').textContent = pet.especie || 'Não informado';
        document.getElementById('pet-breed').textContent = pet.raca || 'Não informado';
        document.getElementById('pet-age').textContent = pet.idade || 'Não informado'; // EXATAMENTE como no dash.js
        
        // Buscar informações adicionais
        return Promise.all([
            fetch(`http://localhost:1337/medicamentos/pet/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.ok ? res.json() : []).catch(() => []),
            
            fetch(`http://localhost:1337/vacinas/pet/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.ok ? res.json() : []).catch(() => []),
            
            fetch(`http://localhost:1337/procedimentos/pet/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.ok ? res.json() : []).catch(() => [])
        ]);
    })
    .then(([medicamentos, vacinas, procedimentos]) => {
        console.log('Dados adicionais:', {
            medicamentos: medicamentos || [],
            vacinas: vacinas || [],
            procedimentos: procedimentos || []
        });

        // Preencher seções
        fillSection('medications-list', medicamentos, 'medication', 'Nenhuma medicação registrada.');
        fillSection('vaccines-list', vacinas, 'vaccine', 'Nenhuma vacina registrada.');
        fillSection('procedures-list', procedimentos, 'procedure', 'Nenhum procedimento registrado.');
    })
    .catch(error => {
        console.error('Erro:', error);
        showError(`Erro ao carregar detalhes do pet: ${error.message}`);
    })
    .finally(() => {
        loadingIndicator.remove();
    });

    // ... (as funções fillSection, createMedicationCard, createVaccineCard, 
    // createProcedureCard, formatDate e showError permanecem exatamente como no código anterior)
});