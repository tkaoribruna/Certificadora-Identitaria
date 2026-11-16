
// commentService.js => Aplica as validações e regras de negócio dos comentários.

const commentRepository = require('../repositories/commentRepository');
const learningMaterialRepository = require('../repositories/learningMaterialRepository');
const discussionTopicRepository = require('../repositories/discussionTopicRepository');

// Valida IDs numéricos positivos
function validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID inválido.');
    }
}

// Valida o conteúdo do comentário
function validateContent(content) {
    if (typeof content !== 'string' || !content.trim()) {
        throw new Error('O conteúdo do comentário é obrigatório.');
    }
}

// Cadastra um comentário
async function createComment({
    content,
    userId,
    learningMaterialId,
    discussionTopicId
}) {
    validateContent(content);
    validateId(userId);

    const hasMaterial = learningMaterialId !== undefined && learningMaterialId !== null;
    const hasTopic = discussionTopicId !== undefined && discussionTopicId !== null;

    // Exige exatamente um destino
    if (hasMaterial === hasTopic) {
        throw new Error(
            'O comentário deve pertencer a um material ou a um tópico.'
        );
    }

    const data = {
        content: content.trim(),
        userId
    };

    if (hasMaterial) {
        validateId(learningMaterialId);

        const material = await learningMaterialRepository.findById(
            learningMaterialId
        );

        if (!material) {
            throw new Error('Material não encontrado.');
        }

        data.learningMaterialId = learningMaterialId;
    }

    if (hasTopic) {
        validateId(discussionTopicId);

        const topic = await discussionTopicRepository.findById(
            discussionTopicId
        );

        if (!topic) {
            throw new Error('Tópico não encontrado.');
        }

        data.discussionTopicId = discussionTopicId;
    }

    return commentRepository.create(data);
}

// Lista todos os comentários
async function listComments() {
    return commentRepository.findAll();
}

// Busca um comentário pelo ID
async function getCommentById(id) {
    validateId(id);

    const comment = await commentRepository.findById(id);

    if (!comment) {
        throw new Error('Comentário não encontrado.');
    }

    return comment;
}

// Lista comentários de um material
async function listCommentsByMaterial(materialId) {
    validateId(materialId);

    const material = await learningMaterialRepository.findById(materialId);

    if (!material) {
        throw new Error('Material não encontrado.');
    }

    return commentRepository.findByMaterialId(materialId);
}

// Lista comentários de um tópico
async function listCommentsByTopic(topicId) {
    validateId(topicId);

    const topic = await discussionTopicRepository.findById(topicId);

    if (!topic) {
        throw new Error('Tópico não encontrado.');
    }

    return commentRepository.findByTopicId(topicId);
}

// Atualiza um comentário
async function updateComment(id, content, user) {
    validateContent(content);

    const comment = await getCommentById(id);

    if (user.role !== 'ADMIN' && comment.userId !== user.id) {
        throw new Error('Você não tem permissão para alterar este comentário.');
    }

    return commentRepository.update(id, {
        content: content.trim()
    });
}

// Exclui um comentário
async function deleteComment(id, user) {
    const comment = await getCommentById(id);

    if (user.role !== 'ADMIN' && comment.userId !== user.id) {
        throw new Error('Você não tem permissão para excluir este comentário.');
    }

    return commentRepository.remove(id);
}

module.exports = {
    createComment,
    listComments,
    getCommentById,
    listCommentsByMaterial,
    listCommentsByTopic,
    updateComment,
    deleteComment
};
