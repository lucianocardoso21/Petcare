/*
  Inspired by: "Login Page & Homepage"
  By: Neo
  Link: https://dribbble.com/shots/4485321-Login-Page-Homepage
*/
document.addEventListener("DOMContentLoaded", function () {
  let cpfInput = document.getElementById("cpf");
  let senhaInput = document.getElementById("senha");

  if (cpfInput) cpfInput.value = "";
  if (senhaInput) senhaInput.value = "";
});

let usernameInput = document.querySelector('.username');
let passwordInput = document.querySelector('.password');
let showPasswordButton = document.querySelector('.password-button');
let face = document.querySelector('.face');

passwordInput.addEventListener('focus', event => {
  document.querySelectorAll('.hand').forEach(hand => {
    hand.classList.add('hide');
  });
  document.querySelector('.tongue').classList.remove('breath');
});

passwordInput.addEventListener('blur', event => {
  document.querySelectorAll('.hand').forEach(hand => {
    hand.classList.remove('hide');
    hand.classList.remove('peek');
  });
  document.querySelector('.tongue').classList.add('breath');
});

usernameInput.addEventListener('focus', event => {
  let length = Math.min(usernameInput.value.length - 16, 19);
  document.querySelectorAll('.hand').forEach(hand => {
    hand.classList.remove('hide');
    hand.classList.remove('peek');
  });

  face.style.setProperty('--rotate-head', `${-length}deg`);
});

usernameInput.addEventListener('blur', event => {
  face.style.setProperty('--rotate-head', '0deg');
});

usernameInput.addEventListener('input', _.throttle(event => {
  let length = Math.min(event.target.value.length - 16, 19);

  face.style.setProperty('--rotate-head', `${-length}deg`);
}, 100));

showPasswordButton.addEventListener('click', event => {
  if (passwordInput.type === 'text') {
    passwordInput.type = 'password';
    document.querySelectorAll('.hand').forEach(hand => {
      hand.classList.remove('peek');
      hand.classList.add('hide');
    });
  } else {
    passwordInput.type = 'text';
    document.querySelectorAll('.hand').forEach(hand => {
      hand.classList.remove('hide');
      hand.classList.add('peek');
    });
  }
});

/** FORMULARIO DE LOGIN */
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  let cpf = document.getElementById("cpf").value.replace(/\D/g, '');
  const senha = document.getElementById("senha").value;

  // Enviar dados para o backend
  // cpf = cpf.replace(/\D/g, '');
  const requestData = { cpf, senha }
  console.log("Enviando dados para o backend:", requestData);
  fetch("http://localhost:1337/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
  })
  .then(response => {
    // Verificar se a resposta é válida
    if (!response.ok) {
        throw new Error("Erro ao conectar com o backend");
    }
    return response.json();
  })
  .then(data => {
      if (data.success && data.token) {
          // Armazena o token no localStorage (ou sessionStorage)
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('cpf', cpf);

          // Redireciona para o dashboard em React
          window.location.href = "http://127.0.0.1:5500/frontend/Dash/Dash.html"; // Substitua com o URL real do seu dashboard
      } else {
          // Exibe mensagem de erro
          document.getElementById("error-message").style.display = "block";
      }
  })
  .catch(error => {
      console.error("Erro ao fazer login:", error);
      document.getElementById("error-message").style.display = "block";
  });
  document.querySelector("#cpf").value = '';
  document.querySelector("#senha").value = '';
});

const toggleMostrar = document.querySelector('#botao-mostrar');
toggleMostrar.addEventListener('click', (evt) => {
  evt.preventDefault();
  toggleMostrar.innerText = toggleMostrar.innerText === 'Mostrar' ? 'Ocultar' : 'Mostrar';
  console.log(toggleMostrar.innerText);
  
});

function abrirCadastro() {
  window.open('../TelaCadastroHtml/Cadastro.html', '_blank', 'width=600, height=800'); // Ajuste as dimensões conforme necessário
}

// Mover com Enter entre campos
document.getElementById("cpf").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("senha").focus();
  }
});

document.getElementById("senha").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector("#login-form button[type='submit']").click();
  }
});
