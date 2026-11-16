
// tokenService.js => Gera e valida tokens JWT utilizados na autenticação.

const jwt = require('jsonwebtoken');
require('dotenv/config');

// Obtém e valida a chave secreta
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.trim().length < 32) {
        throw new Error(
            'JWT_SECRET não configurada ou muito curta. Utilize uma chave com pelo menos 32 caracteres.'
        );
    }

    return secret;
}

// Gera um token para o usuário autenticado
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        getJwtSecret(),
        {
            algorithm: 'HS256',
            expiresIn: '2h'
        }
    );
}

// Verifica se um token é válido
function verifyToken(token) {
    return jwt.verify(
        token,
        getJwtSecret(),
        {
            algorithms: ['HS256']
        }
    );
}

module.exports = {
    generateToken,
    verifyToken
};
