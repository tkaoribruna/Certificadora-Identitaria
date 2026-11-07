
// adminMiddleware.js => Verifica se o usuário possui permissão de administrador.

function adminMiddleware(req, res, next) {
    // Verifica se o usuário está autenticado
    if (!req.user) {
        return res.status(401).json({
            error: 'Usuário não autenticado.'
        });
    }

    // Verifica se o usuário é administrador
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Acesso permitido apenas para administradores.'
        });
    }

    // Autoriza o acesso
    next();
}

module.exports = adminMiddleware;
