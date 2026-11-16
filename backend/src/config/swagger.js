
// swagger.js => Configura a documentação OpenAPI da API CyberAcademy.

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'CyberAcademy API',
            version: '1.0.0',
            description: 'Documentação da API do projeto CyberAcademy.'
        },

        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor local de desenvolvimento'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },

        tags: [
            { name: 'Health', description: 'Verificação do servidor' },
            { name: 'Usuários', description: 'Cadastro e autenticação' },
            { name: 'Módulos', description: 'Gerenciamento dos módulos' },
            { name: 'Materiais', description: 'Materiais de aprendizagem' },
            { name: 'Tópicos', description: 'Tópicos de discussão' },
            { name: 'Comentários', description: 'Comentários da plataforma' },
            { name: 'Submissões', description: 'Envios e moderação de conteúdos' }
        ]
    },

    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
