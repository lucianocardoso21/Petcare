async function login() {
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpf, senha })
    });

    if (response.ok) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
    } else {
        alert('Login falhou! Verifique seu CPF e senha.');
    }
}