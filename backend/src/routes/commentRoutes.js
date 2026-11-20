
// commentRoutes.js => Define as rotas dos comentários, aplica autenticação e documenta os endpoints no Swagger.

const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { postingLimiter } = require('../middlewares/rateLimitMiddleware');

// Todas as rotas abaixo exigem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Cadastra um comentário
 *     description: Cria um comentário vinculado a um material de aprendizagem ou a um tópico de discussão. Informe apenas um dos dois identificadores.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Excelente explicação sobre segurança digital!
 *               learningMaterialId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               discussionTopicId:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       201:
 *         description: Comentário cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos ou associação incorreta.
 *       422:
 *         description: Conteúdo bloqueado pela moderação automática.
 *       429:
 *         description: Muitas publicações em pouco tempo.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Material ou tópico não encontrado.
 */
router.post(
    '/api/comments',
    postingLimiter,
    commentController.createComment
);

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Lista todos os comentários
 *     description: Retorna os comentários cadastrados na plataforma.
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentários retornada com sucesso.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/comments',
    commentController.listComments
);

/**
 * @swagger
 * /api/materials/{materialId}/comments:
 *   get:
 *     summary: Lista os comentários de um material
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         description: Identificador do material de aprendizagem.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Comentários do material retornados com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/materials/:materialId/comments',
    commentController.listCommentsByMaterial
);

/**
 * @swagger
 * /api/topics/{topicId}/comments:
 *   get:
 *     summary: Lista os comentários de um tópico
 *     tags:
 *       - Comentários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         description: Identificador do tópico de discussão.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Comentários do tópico retornados com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/topics/:topicId/comments',
    commentController.listCommentsByTopic
);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Busca um comentário pelo ID
 *     tags:
 *       - Comentários
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
 *       200:
 *         description: Comentário encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Comentário não encontrado.
 */
router.get(
    '/api/comments/:id',
    commentController.getCommentById
);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Atualiza um comentário
 *     description: Permite que o autor do comentário ou um administrador atualize seu conteúdo.
 *     tags:
 *       - Comentários
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Comentário atualizado sobre cibersegurança.
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para atualizar o comentário.
 *       404:
 *         description: Comentário não encontrado.
 */
router.put(
    '/api/comments/:id',
    postingLimiter,
    commentController.updateComment
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Exclui um comentário
 *     description: Permite que o autor do comentário ou um administrador realize sua exclusão.
 *     tags:
 *       - Comentários
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
 *         description: Comentário excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para excluir o comentário.
 *       404:
 *         description: Comentário não encontrado.
 */
router.delete(
    '/api/comments/:id',
    commentController.deleteComment
);

module.exports = router;
