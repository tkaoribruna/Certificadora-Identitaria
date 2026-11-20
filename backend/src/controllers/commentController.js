
// commentController.js => Controla as requisições HTTP dos comentários.

const commentService = require('../services/commentService');

// Trata os erros das operações
function handleError(res, error, action) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error: error.message,
            ...(error.moderationStatus && {
                moderationStatus: error.moderationStatus
            })
        });
    }

    const validationErrors = [
        'ID inválido.',
        'O conteúdo do comentário é obrigatório.',
        'O comentário deve pertencer a um material ou a um tópico.'
    ];

    if (validationErrors.includes(error.message)) {
        return res.status(400).json({
            error: error.message
        });
    }

    const notFoundErrors = [
        'Comentário não encontrado.',
        'Material não encontrado.',
        'Tópico não encontrado.'
    ];

    if (notFoundErrors.includes(error.message)) {
        return res.status(404).json({
            error: error.message
        });
    }

    const permissionErrors = [
        'Você não tem permissão para alterar este comentário.',
        'Você não tem permissão para excluir este comentário.'
    ];

    if (permissionErrors.includes(error.message)) {
        return res.status(403).json({
            error: error.message
        });
    }

    console.error(`Erro ao ${action} comentário:`, error);

    return res.status(500).json({
        error: 'Erro interno no servidor.'
    });
}

// Cadastra um comentário
async function createComment(req, res) {
    try {
        const {
            content,
            learningMaterialId,
            discussionTopicId
        } = req.body;

        const comment = await commentService.createComment({
            content,
            userId: req.user.id,
            learningMaterialId,
            discussionTopicId
        });

        return res.status(201).json(comment);
    } catch (error) {
        return handleError(res, error, 'cadastrar');
    }
}

// Lista todos os comentários
async function listComments(req, res) {
    try {
        const comments = await commentService.listComments(req.user);

        return res.status(200).json(comments);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Busca um comentário pelo ID
async function getCommentById(req, res) {
    try {
        const id = Number(req.params.id);

        const comment = await commentService.getCommentById(id, req.user);

        return res.status(200).json(comment);
    } catch (error) {
        return handleError(res, error, 'buscar');
    }
}

// Lista os comentários de um material
async function listCommentsByMaterial(req, res) {
    try {
        const materialId = Number(req.params.materialId);

        const comments = await commentService.listCommentsByMaterial(
            materialId,
            req.user
        );

        return res.status(200).json(comments);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Lista os comentários de um tópico
async function listCommentsByTopic(req, res) {
    try {
        const topicId = Number(req.params.topicId);

        const comments = await commentService.listCommentsByTopic(
            topicId,
            req.user
        );

        return res.status(200).json(comments);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Atualiza um comentário
async function updateComment(req, res) {
    try {
        const id = Number(req.params.id);
        const { content } = req.body;

        const comment = await commentService.updateComment(
            id,
            content,
            req.user
        );

        return res.status(200).json(comment);
    } catch (error) {
        return handleError(res, error, 'atualizar');
    }
}

// Exclui um comentário
async function deleteComment(req, res) {
    try {
        const id = Number(req.params.id);

        await commentService.deleteComment(id, req.user);

        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'excluir');
    }
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
