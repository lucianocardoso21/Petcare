const jwt = require('jsonwebtoken');
const secretKey = 'password';  // Deve ser a mesma chave usada para gerar o token

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtém o cabeçalho de autorização
    if (!authHeader) {
        console.error('Token não fornecido no cabeçalho de autorização.');
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];  // Pega o token após 'Bearer'
    if (!token) {
        console.error('Token não encontrado no cabeçalho de autorização.');
        return res.status(401).json({ error: 'Token não encontrado' });
    }

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

module.exports = verificarToken;
