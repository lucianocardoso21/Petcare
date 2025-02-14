/*
  Inspired by: "Login Page & Homepage"
  By: Neo
  Link: https://dribbble.com/shots/4485321-Login-Page-Homepage
*/

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

  let cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senha").value;

  // Enviar dados para o backend
  cpf = cpf.replace(/\D/g, '');
  const requestData = { cpf, senha }
  console.log("Enviando dados para o backend:", requestData);
  fetch("http://localhost:1337/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ cpf, senha })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Armazena o token no localStorage (ou sessionStorage)
          localStorage.setItem('authToken', data.token);

          // Redireciona para o dashboard
          window.location.href = "/dashboard.html"; // Substitua com o URL real do seu dashboard
      } else {
          // Exibe mensagem de erro
          document.getElementById("error-message").style.display = "block";
      }
  })
  .catch(error => {
      console.error("Erro ao fazer login:", error);
  });
});
