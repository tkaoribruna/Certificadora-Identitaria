
// server.js => Inicializa o servidor Express e registra as rotas da API.

const express = require('express');

const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const moduleRoutes = require('./routes/moduleRoutes');

const app = express();
const PORT = 3001;

// Permite receber dados JSON
app.use(express.json());

// Registra as rotas da aplicação
app.use(healthRoutes);
app.use(userRoutes);
app.use(moduleRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
