
// commentService.js => Aplica as validações, a moderação e as regras de negócio dos comentários.

const commentRepository = require('../repositories/commentRepository');
const learningMaterialRepository = require('../repositories/learningMaterialRepository');
const discussionTopicRepository = require('../repositories/discussionTopicRepository');
const moderationService = require('./moderationService');
const httpError = require('../utils/httpError');
const { isAdmin, visibilityWhere, canView, present, presentMany } = require('../utils/visibility');

const MAX_CONTENT = 2000;

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

    if (content.trim().length > MAX_CONTENT) {
        throw httpError(`O comentário deve ter no máximo ${MAX_CONTENT} caracteres.`, 400);
    }
}

// Passa o texto pela moderação
async function moderateComment(content) {
    const verdict = await moderationService.moderate({
        kind: 'comment',
        text: content
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

        // Só é possível responder tópicos já aprovados
        if (!topic || topic.moderationStatus !== 'APPROVED') {
            throw new Error('Tópico não encontrado.');
        }

        data.discussionTopicId = discussionTopicId;
    }

    const { verdict, fields } = await moderateComment(data.content);

    // Grava inclusive os bloqueados, para o administrador poder auditar as tentativas
    const comment = await commentRepository.create({
        ...data,
        ...fields
    });

    if (verdict.status === 'REJECTED') {
        throw rejected(verdict);
    }

    return present(comment, { id: userId });
}

// Lista os comentários que o usuário pode ver
async function listComments(user) {
    const comments = await commentRepository.findAll(visibilityWhere(user));

    return presentMany(comments, user);
}

// Busca um comentário pelo ID (respeitando a visibilidade)
async function getCommentById(id, user) {
    validateId(id);

    const comment = await commentRepository.findById(id);

    if (!comment || !canView(comment, user)) {
        throw new Error('Comentário não encontrado.');
    }

    return present(comment, user);
}

// Lista comentários de um material
async function listCommentsByMaterial(materialId, user) {
    validateId(materialId);

    const material = await learningMaterialRepository.findById(materialId);

    if (!material) {
        throw new Error('Material não encontrado.');
    }

    const comments = await commentRepository.findByMaterialId(
        materialId,
        visibilityWhere(user)
    );

    return presentMany(comments, user);
}

// Lista comentários de um tópico
async function listCommentsByTopic(topicId, user) {
    validateId(topicId);

    const topic = await discussionTopicRepository.findById(topicId);

    if (!topic || !canView(topic, user)) {
        throw new Error('Tópico não encontrado.');
    }

    const comments = await commentRepository.findByTopicId(
        topicId,
        visibilityWhere(user)
    );

    return presentMany(comments, user);
}

// Atualiza um comentário (o texto novo passa pela moderação novamente)
async function updateComment(id, content, user) {
    validateContent(content);

    const comment = await getCommentById(id, user);

    if (!isAdmin(user) && comment.userId !== user.id) {
        throw new Error('Você não tem permissão para alterar este comentário.');
    }

    const cleanContent = content.trim();
    let fields = {};

    // Administradores são confiáveis; os demais passam pela moderação
    if (!isAdmin(user)) {
        const result = await moderateComment(cleanContent);

        if (result.verdict.status === 'REJECTED') {
            throw rejected(result.verdict);
        }

        fields = result.fields;
    }

    const updated = await commentRepository.update(id, {
        content: cleanContent,
        ...fields
    });

    return present(updated, user);
}

// Exclui um comentário
async function deleteComment(id, user) {
    const comment = await getCommentById(id, user);

    if (!isAdmin(user) && comment.userId !== user.id) {
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
