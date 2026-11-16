
// discussionTopicService.js => Aplica as validações e regras de negócio dos tópicos de discussão.

const discussionTopicRepository = require('../repositories/discussionTopicRepository');

// Valida o ID recebido
function validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID inválido.');
    }
}

// Valida o título e a descrição
function validateTopicData(title, description) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof description !== 'string' ||
        !description.trim()
    ) {
        throw new Error('Título e descrição são obrigatórios.');
    }
}

// Cadastra um novo tópico
async function createTopic({ title, description, userId }) {
    validateTopicData(title, description);
    validateId(userId);

    return discussionTopicRepository.create({
        title: title.trim(),
        description: description.trim(),
        userId
    });
}

// Lista todos os tópicos
async function listTopics() {
    return discussionTopicRepository.findAll();
}

// Busca um tópico pelo ID
async function getTopicById(id) {
    validateId(id);

    const topic = await discussionTopicRepository.findById(id);

    if (!topic) {
        throw new Error('Tópico não encontrado.');
    }

    return topic;
}

// Lista os tópicos criados por um usuário
async function listTopicsByUser(userId) {
    validateId(userId);

    return discussionTopicRepository.findByUserId(userId);
}

// Atualiza um tópico
async function updateTopic(id, { title, description }, user) {
    validateTopicData(title, description);

    const topic = await getTopicById(id);

    if (user.role !== 'ADMIN' && topic.userId !== user.id) {
        throw new Error('Você não tem permissão para alterar este tópico.');
    }

    return discussionTopicRepository.update(id, {
        title: title.trim(),
        description: description.trim()
    });
}

// Exclui um tópico
async function deleteTopic(id, user) {
    const topic = await getTopicById(id);

    if (user.role !== 'ADMIN' && topic.userId !== user.id) {
        throw new Error('Você não tem permissão para excluir este tópico.');
    }

    try {
        return await discussionTopicRepository.remove(id);
    } catch (error) {
        if (error.code === 'P2003') {
            throw new Error(
                'Não é possível excluir um tópico que possui conteúdos vinculados.'
            );
        }

        throw error;
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
