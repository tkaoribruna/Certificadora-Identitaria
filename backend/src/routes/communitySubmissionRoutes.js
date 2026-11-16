
// communitySubmissionRoutes.js => Define as rotas, permissões e documentação Swagger das submissões.

const express = require('express');
const router = express.Router();

const submissionController = require('../controllers/communitySubmissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Todas as rotas exigem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Cadastra uma nova submissão
 *     description: Permite que STUDENT ou ADMIN envie um conteúdo para avaliação. A submissão inicia com status PENDING.
 *     tags:
 *       - Submissões
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
 *               - url
 *               - discussionTopicId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Artigo sobre segurança digital
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/artigo
 *               discussionTopicId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Submissão cadastrada com status PENDING.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Tópico não encontrado.
 */
router.post(
    '/api/submissions',
    submissionController.createSubmission
);

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Lista submissões conforme as permissões
 *     description: ADMIN visualiza todas. STUDENT visualiza submissões aprovadas e as próprias, independentemente do status.
 *     tags:
 *       - Submissões
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de submissões retornada com sucesso.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
router.get(
    '/api/submissions',
    submissionController.listSubmissions
);

/**
 * @swagger
 * /api/submissions/status/{status}:
 *   get:
 *     summary: Lista submissões por status
 *     description: Consulta exclusiva para administradores.
 *     tags:
 *       - Submissões
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - REJECTED
 *     responses:
 *       200:
 *         description: Submissões filtradas com sucesso.
 *       400:
 *         description: Status inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 */
router.get(
    '/api/submissions/status/:status',
    adminMiddleware,
    submissionController.listSubmissionsByStatus
);

/**
 * @swagger
 * /api/users/{userId}/submissions:
 *   get:
 *     summary: Lista as submissões de um usuário
 *     description: ADMIN consulta qualquer usuário. STUDENT consulta somente as próprias submissões.
 *     tags:
 *       - Submissões
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Submissões do usuário retornadas com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para consultar essas submissões.
 */
router.get(
    '/api/users/:userId/submissions',
    submissionController.listSubmissionsByUser
);

/**
 * @swagger
 * /api/topics/{topicId}/submissions:
 *   get:
 *     summary: Lista as submissões de um tópico
 *     description: ADMIN visualiza todas as submissões do tópico. STUDENT visualiza somente as aprovadas e as próprias.
 *     tags:
 *       - Submissões
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Submissões do tópico retornadas com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       404:
 *         description: Tópico não encontrado.
 */
router.get(
    '/api/topics/:topicId/submissions',
    submissionController.listSubmissionsByTopic
);

/**
 * @swagger
 * /api/submissions/{id}:
 *   get:
 *     summary: Busca uma submissão pelo ID
 *     description: ADMIN consulta qualquer submissão. STUDENT consulta submissões aprovadas ou de sua autoria.
 *     tags:
 *       - Submissões
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
 *         description: Submissão encontrada.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para visualizar a submissão.
 *       404:
 *         description: Submissão não encontrada.
 */
router.get(
    '/api/submissions/:id',
    submissionController.getSubmissionById
);

/**
 * @swagger
 * /api/submissions/{id}:
 *   put:
 *     summary: Atualiza uma submissão pendente
 *     description: ADMIN ou autor podem atualizar uma submissão enquanto estiver PENDING.
 *     tags:
 *       - Submissões
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
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: Artigo atualizado sobre cibersegurança
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/artigo-atualizado
 *     responses:
 *       200:
 *         description: Submissão atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para atualizar a submissão.
 *       404:
 *         description: Submissão não encontrada.
 *       409:
 *         description: Submissão já moderada.
 */
router.put(
    '/api/submissions/:id',
    submissionController.updateSubmission
);

/**
 * @swagger
 * /api/submissions/{id}/moderate:
 *   patch:
 *     summary: Aprova ou rejeita uma submissão
 *     description: Somente ADMIN pode moderar submissões PENDING. O ID do moderador é registrado.
 *     tags:
 *       - Submissões
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - APPROVED
 *                   - REJECTED
 *                 example: APPROVED
 *     responses:
 *       200:
 *         description: Submissão moderada com sucesso.
 *       400:
 *         description: Status ou ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Submissão não encontrada.
 *       409:
 *         description: Submissão já moderada.
 */
router.patch(
    '/api/submissions/:id/moderate',
    adminMiddleware,
    submissionController.moderateSubmission
);

/**
 * @swagger
 * /api/submissions/{id}:
 *   delete:
 *     summary: Exclui uma submissão pendente
 *     description: ADMIN ou autor podem excluir uma submissão somente enquanto estiver PENDING.
 *     tags:
 *       - Submissões
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
 *         description: Submissão excluída com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *       403:
 *         description: Usuário sem permissão para excluir a submissão.
 *       404:
 *         description: Submissão não encontrada.
 *       409:
 *         description: Somente submissões pendentes podem ser excluídas.
 */
router.delete(
    '/api/submissions/:id',
    submissionController.deleteSubmission
);

module.exports = router;
