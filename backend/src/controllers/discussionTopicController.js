
// discussionTopicController.js => Controla as requisições HTTP dos tópicos de discussão.

const discussionTopicService = require('../services/discussionTopicService');

// Trata os erros das operações
function handleError(res, error, action) {
    const validationErrors = [
        'ID inválido.',
        'Título e descrição são obrigatórios.'
    ];

    if (validationErrors.includes(error.message)) {
        return res.status(400).json({
            error: error.message
        });
    }

    if (error.message === 'Tópico não encontrado.') {
        return res.status(404).json({
            error: error.message
        });
    }

    if (
        error.message === 'Você não tem permissão para alterar este tópico.' ||
        error.message === 'Você não tem permissão para excluir este tópico.'
    ) {
        return res.status(403).json({
            error: error.message
        });
    }

    if (
        error.message ===
        'Não é possível excluir um tópico que possui conteúdos vinculados.'
    ) {
        return res.status(409).json({
            error: error.message
        });
    }

    console.error(`Erro ao ${action} tópico:`, error);

    return res.status(500).json({
        error: 'Erro interno no servidor.'
    });
}

// Cadastra um novo tópico
async function createTopic(req, res) {
    try {
        const { title, description } = req.body;

        const topic = await discussionTopicService.createTopic({
            title,
            description,
            userId: req.user.id
        });

        return res.status(201).json(topic);
    } catch (error) {
        return handleError(res, error, 'cadastrar');
    }
}

// Lista todos os tópicos
async function listTopics(req, res) {
    try {
        const topics = await discussionTopicService.listTopics();

        return res.status(200).json(topics);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Busca um tópico pelo ID
async function getTopicById(req, res) {
    try {
        const id = Number(req.params.id);

        const topic = await discussionTopicService.getTopicById(id);

        return res.status(200).json(topic);
    } catch (error) {
        return handleError(res, error, 'buscar');
    }
}

// Lista os tópicos de um usuário
async function listTopicsByUser(req, res) {
    try {
        const userId = Number(req.params.userId);

        const topics = await discussionTopicService.listTopicsByUser(userId);

        return res.status(200).json(topics);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Atualiza um tópico
async function updateTopic(req, res) {
    try {
        const id = Number(req.params.id);
        const { title, description } = req.body;

        const topic = await discussionTopicService.updateTopic(
            id,
            { title, description },
            req.user
        );

        return res.status(200).json(topic);
    } catch (error) {
        return handleError(res, error, 'atualizar');
    }
}

// Exclui um tópico
async function deleteTopic(req, res) {
    try {
        const id = Number(req.params.id);

        await discussionTopicService.deleteTopic(id, req.user);

        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'excluir');
    }
}

module.exports = {
    createTopic,
    listTopics,
    getTopicById,
    listTopicsByUser,
    updateTopic,
    deleteTopic
};
