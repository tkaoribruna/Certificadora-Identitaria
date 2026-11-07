
// moduleRoutes.js => Define as rotas dos módulos de ensino e suas permissões de acesso.

const express = require('express');
const router = express.Router();

const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Cadastra um módulo (somente administradores)
router.post(
    '/api/modules',
    authMiddleware,
    adminMiddleware,
    moduleController.createModule
);

// Lista os módulos (usuários autenticados)
router.get(
    '/api/modules',
    authMiddleware,
    moduleController.listModules
);

// Busca um módulo pelo ID (usuários autenticados)
router.get(
    '/api/modules/:id',
    authMiddleware,
    moduleController.getModuleById
);

module.exports = router;
