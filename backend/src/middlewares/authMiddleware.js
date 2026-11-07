
// authMiddleware.js => Valida o JWT e consulta as permissões atuais do usuário no MySQL.

const tokenService = require('../services/tokenService');
const userRepository = require('../repositories/userRepository');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Token não fornecido.'
        });
    }

    const token = authHeader.split(' ')[1];

    let decoded;

    try {
        decoded = tokenService.verifyToken(token);
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido ou expirado.'
        });
    }

    try {
        // Consulta o perfil atualizado no MySQL
        const user = await userRepository.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                error: 'Usuário não encontrado.'
            });
        }

        // Utiliza o perfil atual do banco, não o do JWT
        req.user = {
            id: user.id,
            role: user.role
        };

        next();

    } catch (error) {
        return res.status(500).json({
            error: 'Erro interno ao verificar o usuário.'
        });
    }
}

module.exports = authMiddleware;
