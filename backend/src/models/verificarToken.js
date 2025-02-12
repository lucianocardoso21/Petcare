const jwt = require('jsonwebtoken');
const secretKey = 'password';  // Deve ser a mesma chave usada para gerar o token

const verificaToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtém o cabeçalho de autorização
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];  // Pega o token após 'Bearer'
    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }

    // console.log('Token recebido:', token); // Log do token recebido

    // Verifica a validade do token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do token:', err); // Log do erro
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        // Se o token for válido, armazena as informações do usuário no req.user
        req.user = decoded;
        next();  // Passa para o próximo middleware ou controlador
    });
};

module.exports = verificaToken;
