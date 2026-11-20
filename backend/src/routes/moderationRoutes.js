
// moderationRoutes.js => Rotas da fila de moderação (apenas administradores) e sua documentação Swagger.

const express = require('express');
const router = express.Router();

const moderationController = require('../controllers/moderationController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Todas as rotas abaixo exigem um administrador autenticado
router.use('/api/moderation', authMiddleware, adminMiddleware);

/**
 * @swagger
 * /api/moderation/queue:
 *   get:
 *     summary: Lista os conteúdos aguardando moderação
 *     description: Retorna tópicos e comentários com o status informado. Por padrão, os pendentes de revisão.
 *     tags:
 *       - Moderação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - REJECTED
 *           default: PENDING
 *     responses:
 *       200:
 *         description: Objeto com as listas "topics" e "comments".
 *       400:
 *         description: Status inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão de administrador.
 */
router.get('/api/moderation/queue', moderationController.getQueue);

/**
 * @swagger
 * /api/moderation/topics/{id}:
 *   patch:
 *     summary: Aprova ou rejeita um tópico
 *     tags:
 *       - Moderação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - decision
 *             properties:
 *               decision:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECTED
 *               reason:
 *                 type: string
 *                 example: Orientação insegura.
 *     responses:
 *       200:
 *         description: Tópico moderado.
 *       400:
 *         description: Dados inválidos.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Tópico não encontrado.
 */
router.patch('/api/moderation/topics/:id', moderationController.moderateTopic);

/**
 * @swagger
 * /api/moderation/comments/{id}:
 *   patch:
 *     summary: Aprova ou rejeita um comentário
 *     tags:
 *       - Moderação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - decision
 *             properties:
 *               decision:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECTED
 *               reason:
 *                 type: string
 *                 example: Link suspeito.
 *     responses:
 *       200:
 *         description: Comentário moderado.
 *       400:
 *         description: Dados inválidos.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Comentário não encontrado.
 */
router.patch('/api/moderation/comments/:id', moderationController.moderateComment);

module.exports = router;
