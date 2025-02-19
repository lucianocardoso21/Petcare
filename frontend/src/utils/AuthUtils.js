// authUtils.js

export function GetAuthToken() {
  return localStorage.getItem('authToken'); // Recupera o token armazenado
}

export const verificarAutenticacao = async () => {
  const token = GetAuthToken(); // Recupera o token com a função GetAuthToken
  if (!token) {
    return false; // Se não houver token, o usuário não está autenticado
  }

  try {
    const response = await fetch('http://localhost:1337/auth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho da requisição
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    const data = await response.json();
    return data.message === 'Usuário autenticado com sucesso!';
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return false;
  }
};
