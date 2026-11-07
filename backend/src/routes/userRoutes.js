
// userRoutes.js => Define as rotas de cadastro, login e acesso protegido dos usuários.

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota pública para cadastrar usuários
router.post('/api/users', userController.createUser);

// Rota pública para realizar login
router.post('/api/users/login', userController.loginUser);

// Rota protegida para usuários autenticados
router.get('/api/users/me', authMiddleware, (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        role: req.user.role
    });
});

// Rota de teste exclusiva para administradores
router.get(
    '/api/admin/test',
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        return res.status(200).json({
            message: 'Acesso de administrador autorizado.'
        });
    }
);

module.exports = router;
