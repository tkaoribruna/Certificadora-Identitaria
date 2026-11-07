
// tokenService.js

const jwt = require('jsonwebtoken');
require('dotenv/config');

// Gera um token para o usuário autenticado
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '2h'
        }
    );
}

// Verifica se um token é válido
function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};
