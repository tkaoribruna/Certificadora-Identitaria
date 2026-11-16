
// learningMaterialRoutes.js => Define as rotas dos materiais de aprendizagem, suas permissões e documentação Swagger.

const express = require('express');
const router = express.Router();

const learningMaterialController = require('../controllers/learningMaterialController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Cadastra um material de aprendizagem
 *     description: Permite que um administrador cadastre um material vinculado a um módulo.
 *     tags:
 *       - Materiais
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
 *               - type
 *               - moduleId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introdução à Cibersegurança
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/aula1
 *               type:
 *                 type: string
 *                 enum:
 *                   - VIDEO
 *                   - SLIDE
 *                   - DOCUMENT
 *               moduleId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Material cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Módulo não encontrado.
 */
router.post(
    '/api/materials',
    authMiddleware,
    adminMiddleware,
    learningMaterialController.createMaterial
);

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Lista todos os materiais de aprendizagem
 *     description: Retorna os materiais cadastrados para usuários autenticados.
 *     tags:
 *       - Materiais
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materiais retornada com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 */
router.get(
    '/api/materials',
    authMiddleware,
    learningMaterialController.listMaterials
);

/**
 * @swagger
 * /api/modules/{moduleId}/materials:
 *   get:
 *     summary: Lista os materiais de um módulo
 *     tags:
 *       - Materiais
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         description: Identificador do módulo.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Materiais do módulo retornados com sucesso.
 *       400:
 *         description: ID do módulo inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Módulo não encontrado.
 */
router.get(
    '/api/modules/:moduleId/materials',
    authMiddleware,
    learningMaterialController.listMaterialsByModule
);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Busca um material pelo ID
 *     tags:
 *       - Materiais
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
 *         description: Material encontrado.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Material não encontrado.
 */
router.get(
    '/api/materials/:id',
    authMiddleware,
    learningMaterialController.getMaterialById
);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Atualiza um material de aprendizagem
 *     description: Permite que um administrador atualize um material existente.
 *     tags:
 *       - Materiais
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
 *                 example: Segurança Digital Avançada
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://exemplo.com/aula-atualizada
 *               type:
 *                 type: string
 *                 enum:
 *                   - VIDEO
 *                   - SLIDE
 *                   - DOCUMENT
 *               moduleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Material atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Material ou módulo não encontrado.
 */
router.put(
    '/api/materials/:id',
    authMiddleware,
    adminMiddleware,
    learningMaterialController.updateMaterial
);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Exclui um material de aprendizagem
 *     description: Permite que um administrador exclua um material sem comentários vinculados.
 *     tags:
 *       - Materiais
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
 *         description: Material excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Material não encontrado.
 *       409:
 *         description: Material possui comentários vinculados.
 */
router.delete(
    '/api/materials/:id',
    authMiddleware,
    adminMiddleware,
    learningMaterialController.deleteMaterial
);

module.exports = router;
