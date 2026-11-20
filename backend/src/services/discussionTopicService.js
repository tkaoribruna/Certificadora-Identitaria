
// discussionTopicService.js => Aplica as validações, a moderação e as regras de negócio dos tópicos de discussão.

const discussionTopicRepository = require('../repositories/discussionTopicRepository');
const moderationService = require('./moderationService');
const httpError = require('../utils/httpError');
const { isAdmin, visibilityWhere, canView, present, presentMany } = require('../utils/visibility');

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 3000;

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

    if (title.trim().length > MAX_TITLE) {
        throw httpError(`O título deve ter no máximo ${MAX_TITLE} caracteres.`, 400);
    }

    if (description.trim().length > MAX_DESCRIPTION) {
        throw httpError(`A descrição deve ter no máximo ${MAX_DESCRIPTION} caracteres.`, 400);
    }
}

// Passa o texto pela moderação e devolve os campos de status a gravar
async function moderateTopic(title, description) {
    const verdict = await moderationService.moderate({
        kind: 'topic',
        text: `${title}\n\n${description}`
    });

    return {
        verdict,
        fields: {
            moderationStatus: verdict.status,
            moderationReason: verdict.reason
        }
    };
}

function rejected(verdict) {
    return httpError(
        `Publicação bloqueada pela moderação: ${verdict.reason || 'o conteúdo viola as regras da plataforma.'}`,
        422,
        { moderationStatus: 'REJECTED' }
    );
}

// Cadastra um novo tópico
async function createTopic({ title, description, userId }) {
    validateTopicData(title, description);
    validateId(userId);

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    const { verdict, fields } = await moderateTopic(cleanTitle, cleanDescription);

    // Grava inclusive os bloqueados, para o administrador poder auditar as tentativas
    const topic = await discussionTopicRepository.create({
        title: cleanTitle,
        description: cleanDescription,
        userId,
        ...fields
    });

    if (verdict.status === 'REJECTED') {
        throw rejected(verdict);
    }

    return present(topic, { id: userId });
}

// Lista os tópicos que o usuário pode ver
async function listTopics(user) {
    const topics = await discussionTopicRepository.findAll(visibilityWhere(user));

    return presentMany(topics, user);
}

// Busca um tópico pelo ID (respeitando a visibilidade)
async function getTopicById(id, user) {
    validateId(id);

    const topic = await discussionTopicRepository.findById(id);

    if (!topic || !canView(topic, user)) {
        throw new Error('Tópico não encontrado.');
    }

    return present(topic, user);
}

// Lista os tópicos criados por um usuário
async function listTopicsByUser(userId, user) {
    validateId(userId);

    const topics = await discussionTopicRepository.findByUserId(
        userId,
        visibilityWhere(user)
    );

    return presentMany(topics, user);
}

// Atualiza um tópico (o texto novo passa pela moderação novamente)
async function updateTopic(id, { title, description }, user) {
    validateTopicData(title, description);

    const topic = await getTopicById(id, user);

    if (!isAdmin(user) && topic.userId !== user.id) {
        throw new Error('Você não tem permissão para alterar este tópico.');
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    let fields = {};

    // Administradores são confiáveis; os demais passam pela moderação
    if (!isAdmin(user)) {
        const result = await moderateTopic(cleanTitle, cleanDescription);

        if (result.verdict.status === 'REJECTED') {
            throw rejected(result.verdict);
        }

        fields = result.fields;
    }

    const updated = await discussionTopicRepository.update(id, {
        title: cleanTitle,
        description: cleanDescription,
        ...fields
    });

    return present(updated, user);
}

// Exclui um tópico
async function deleteTopic(id, user) {
    const topic = await getTopicById(id, user);

    if (!isAdmin(user) && topic.userId !== user.id) {
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
