
// userRoutes.js => Define as rotas de usuários, autenticação e sua documentação Swagger.

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Senha@123456
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: E-mail já cadastrado.
 */
router.post('/api/users', userController.createUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Senha@123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Dados públicos do usuário autenticado.
 *                 token:
 *                   type: string
 *                   description: Token JWT utilizado nas rotas protegidas.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/api/users/login', userController.loginUser);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Consulta o usuário autenticado
 *     description: Retorna o ID e o papel do usuário identificado pelo JWT.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 role:
 *                   type: string
 *                   enum:
 *                     - STUDENT
 *                     - ADMIN
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get('/api/users/me', authMiddleware, (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        role: req.user.role
    });
});

/**
 * @swagger
 * /api/admin/test:
 *   get:
 *     summary: Testa o acesso de administrador
 *     description: Rota temporária para verificar a autorização de usuários ADMIN.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso de administrador autorizado.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de administrador.
 */
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
