//healthRoutes.js ==> organiza as rotas

const express = require('express');
const router = express.Router();//cria e retorna um roteador do Express

router.get('/health', (req, res) => {
    res.json({status: 'ok'});
});


module.exports = router;
