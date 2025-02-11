const jwt = require('jsonwebtoken');
const secretKey = 'seu-segredo-aqui';  // Deve ser a mesma chave usada para gerar o token

const verificaToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Pega o token após 'Bearer'

    console.log("Token recebido:", token); // Log do token recebido

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verifica a validade do token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Erro na verificação do token:', err); // Log do erro
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        // Se o token for válido, armazena as informações do cliente no req.user
        req.user = decoded;
        next();  // Passa para o próximo middleware ou controlador
    });
};


module.exports = verificaToken;
