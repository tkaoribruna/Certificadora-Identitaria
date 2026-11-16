
// moduleRoutes.js => Define as rotas dos módulos e sua documentação Swagger.

const express = require('express');
const router = express.Router();

const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Cadastra um novo módulo
 *     description: Permite que um administrador cadastre um módulo.
 *     tags:
 *       - Módulos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fundamentos de Cibersegurança
 *               description:
 *                 type: string
 *                 example: Introdução aos conceitos de segurança digital.
 *     responses:
 *       201:
 *         description: Módulo cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 */
router.post(
    '/api/modules',
    authMiddleware,
    adminMiddleware,
    moduleController.createModule
);

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Lista todos os módulos
 *     description: Retorna os módulos cadastrados para usuários autenticados.
 *     tags:
 *       - Módulos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de módulos retornada com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 */
router.get(
    '/api/modules',
    authMiddleware,
    moduleController.listModules
);

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Busca um módulo pelo ID
 *     tags:
 *       - Módulos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Identificador do módulo.
 *     responses:
 *       200:
 *         description: Módulo encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Módulo não encontrado.
 */
router.get(
    '/api/modules/:id',
    authMiddleware,
    moduleController.getModuleById
);

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Atualiza um módulo
 *     description: Permite que um administrador atualize um módulo existente.
 *     tags:
 *       - Módulos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cibersegurança Avançada
 *               description:
 *                 type: string
 *                 example: Conteúdo atualizado do módulo.
 *     responses:
 *       200:
 *         description: Módulo atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Módulo não encontrado.
 */
router.put(
    '/api/modules/:id',
    authMiddleware,
    adminMiddleware,
    moduleController.updateModule
);

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Exclui um módulo
 *     description: Permite que um administrador exclua um módulo sem conteúdos vinculados.
 *     tags:
 *       - Módulos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Módulo excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Módulo não encontrado.
 *       409:
 *         description: Módulo possui conteúdos vinculados e não pode ser excluído.
 */
router.delete(
    '/api/modules/:id',
    authMiddleware,
    adminMiddleware,
    moduleController.deleteModule
);

module.exports = router;
