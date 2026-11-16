
// healthRoutes.js => Define a rota de verificação do servidor e sua documentação Swagger.

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica se a API está funcionando
 *     description: Retorna o estado atual do servidor CyberAcademy.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Servidor funcionando corretamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

// Verifica se o servidor está funcionando
router.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'ok'
    });
});

module.exports = router;
