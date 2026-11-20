
// server.js => Inicializa o Express, configura os middlewares e registra as rotas e a documentação da API.

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');

const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const learningMaterialRoutes = require('./routes/learningMaterialRoutes');
const discussionTopicRoutes = require('./routes/discussionTopicRoutes');
const commentRoutes = require('./routes/commentRoutes');
const communitySubmissionRoutes = require('./routes/communitySubmissionRoutes');
const moderationRoutes = require('./routes/moderationRoutes');
const moderationService = require('./services/moderationService');

const app = express();

const PORT = process.env.PORT || 3001;

// Permite requisições do frontend
app.use(cors());

// Permite receber dados JSON
app.use(express.json());

// Disponibiliza a documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registra as rotas da aplicação
app.use(healthRoutes);
app.use(userRoutes);
app.use(moduleRoutes);
app.use(learningMaterialRoutes);
app.use(discussionTopicRoutes);
app.use(commentRoutes);
app.use(communitySubmissionRoutes);
app.use(moderationRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Moderação de conteúdo: ${moderationService.describeSetup()}`);
});
