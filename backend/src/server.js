//server.js ==> conecta os roteadores e configura um servidor para ouvir na porta 3001

const express = require('express');
const app = express();
const PORT = 3001;
const healthRoutes = require('./routes/healthRoutes');

app.use(express.json());//Middleware global, interpreta o JSON recebido no corpo/body das requisições
app.use(healthRoutes);//Registramos um roteador para tratar as requisições

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});