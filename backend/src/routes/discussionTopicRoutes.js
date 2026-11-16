
// discussionTopicRoutes.js => Define as rotas dos tópicos de discussão, suas permissões e documentação Swagger.

const express = require('express');
const router = express.Router();

const discussionTopicController = require('../controllers/discussionTopicController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Cadastra um novo tópico de discussão
 *     description: Permite que um usuário autenticado crie um tópico de discussão.
 *     tags:
 *       - Tópicos
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
 *                 example: Dúvidas sobre cibersegurança
 *               description:
 *                 type: string
 *                 example: Espaço para discutir conceitos de segurança digital.
 *     responses:
 *       201:
 *         description: Tópico cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.post(
    '/api/topics',
    authMiddleware,
    discussionTopicController.createTopic
);

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Lista todos os tópicos de discussão
 *     description: Retorna os tópicos cadastrados para usuários autenticados.
 *     tags:
 *       - Tópicos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tópicos retornada com sucesso.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/topics',
    authMiddleware,
    discussionTopicController.listTopics
);

/**
 * @swagger
 * /api/users/{userId}/topics:
 *   get:
 *     summary: Lista os tópicos criados por um usuário
 *     tags:
 *       - Tópicos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Identificador do usuário.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tópicos do usuário retornados com sucesso.
 *       400:
 *         description: ID do usuário inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/users/:userId/topics',
    authMiddleware,
    discussionTopicController.listTopicsByUser
);

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Busca um tópico pelo ID
 *     tags:
 *       - Tópicos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador do tópico.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tópico encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Tópico não encontrado.
 */
router.get(
    '/api/topics/:id',
    authMiddleware,
    discussionTopicController.getTopicById
);

/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Atualiza um tópico de discussão
 *     description: Permite que o autor do tópico ou um administrador atualize suas informações.
 *     tags:
 *       - Tópicos
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
 *                 example: Cibersegurança e proteção de dados
 *               description:
 *                 type: string
 *                 example: Discussão atualizada sobre segurança digital.
 *     responses:
 *       200:
 *         description: Tópico atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para atualizar o tópico.
 *       404:
 *         description: Tópico não encontrado.
 */
router.put(
    '/api/topics/:id',
    authMiddleware,
    discussionTopicController.updateTopic
);

/**
 * @swagger
 * /api/topics/{id}:
 *   delete:
 *     summary: Exclui um tópico de discussão
 *     description: Permite que o autor do tópico ou um administrador exclua o tópico, desde que não existam conteúdos vinculados que impeçam sua exclusão.
 *     tags:
 *       - Tópicos
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
 *         description: Tópico excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para excluir o tópico.
 *       404:
 *         description: Tópico não encontrado.
 *       409:
 *         description: Tópico possui conteúdos vinculados e não pode ser excluído.
 */
router.delete(
    '/api/topics/:id',
    authMiddleware,
    discussionTopicController.deleteTopic
);

module.exports = router;
