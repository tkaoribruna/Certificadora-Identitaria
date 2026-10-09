//server.js

const express = require('express');//importa o módulo/biblioteca express
const app = express();//Cria uma aplicação Express e guarda esta aplicação em app
//PORT é escrito com letras maiúsculas pois é uma constante de configuração, ela define a porta que o servidor ficará ouvindo
const PORT = 3001;

//app.get cria uma rota que responde a requisições do tipo GET
//req (request/requisição) === é um objeto que possui informações da requisição que chegou ao servidor
//res (response/resposta) === é um objeto que possui informações que serão enviadas como resposta para quem fez a requisição
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });//envia a resposta no formato JSON   
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});