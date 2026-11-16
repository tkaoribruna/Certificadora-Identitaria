
// communitySubmissionController.js => Controla as requisições HTTP das submissões da comunidade.

const submissionService = require('../services/communitySubmissionService');

// Trata os erros das operações
function handleError(res, error, action) {
    const validationErrors = [
        'ID inválido.',
        'Usuário inválido.',
        'Título e URL são obrigatórios.',
        'URL inválida.',
        'Status inválido.',
        'Status de moderação inválido.'
    ];

    if (validationErrors.includes(error.message)) {
        return res.status(400).json({
            error: error.message
        });
    }

    const notFoundErrors = [
        'Tópico não encontrado.',
        'Submissão não encontrada.'
    ];

    if (notFoundErrors.includes(error.message)) {
        return res.status(404).json({
            error: error.message
        });
    }

    const permissionErrors = [
        'Você não tem permissão para visualizar esta submissão.',
        'Você não tem permissão para visualizar estas submissões.',
        'Você não tem permissão para alterar esta submissão.',
        'Você não tem permissão para excluir esta submissão.',
        'Somente administradores podem moderar submissões.'
    ];

    if (permissionErrors.includes(error.message)) {
        return res.status(403).json({
            error: error.message
        });
    }

    const conflictErrors = [
        'Somente submissões pendentes podem ser alteradas.',
        'Somente submissões pendentes podem ser excluídas.',
        'Esta submissão já foi moderada.'
    ];

    if (conflictErrors.includes(error.message)) {
        return res.status(409).json({
            error: error.message
        });
    }

    console.error(`Erro ao ${action} submissão:`, error);

    return res.status(500).json({
        error: 'Erro interno no servidor.'
    });
}

// Cadastra uma nova submissão
async function createSubmission(req, res) {
    try {
        const { title, url, discussionTopicId } = req.body || {};

        const submission = await submissionService.createSubmission({
            title,
            url,
            discussionTopicId,
            userId: req.user.id
        });

        return res.status(201).json(submission);
    } catch (error) {
        return handleError(res, error, 'cadastrar');
    }
}

// Lista submissões conforme as permissões do usuário
async function listSubmissions(req, res) {
    try {
        const submissions = await submissionService.listSubmissions(req.user);

        return res.status(200).json(submissions);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Busca uma submissão pelo ID
async function getSubmissionById(req, res) {
    try {
        const id = Number(req.params.id);

        const submission = await submissionService.getSubmissionById(
            id,
            req.user
        );

        return res.status(200).json(submission);
    } catch (error) {
        return handleError(res, error, 'buscar');
    }
}

// Lista as submissões de um usuário
async function listSubmissionsByUser(req, res) {
    try {
        const userId = Number(req.params.userId);

        const submissions = await submissionService.listSubmissionsByUser(
            userId,
            req.user
        );

        return res.status(200).json(submissions);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Lista as submissões de um tópico
async function listSubmissionsByTopic(req, res) {
    try {
        const topicId = Number(req.params.topicId);

        const submissions = await submissionService.listSubmissionsByTopic(
            topicId,
            req.user
        );

        return res.status(200).json(submissions);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Lista as submissões por status
async function listSubmissionsByStatus(req, res) {
    try {
        // Consulta exclusiva para administradores
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({
                error: 'Acesso permitido apenas para administradores.'
            });
        }

        const status = req.params.status;

        const submissions = await submissionService.listSubmissionsByStatus(
            status
        );

        return res.status(200).json(submissions);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Atualiza uma submissão pendente
async function updateSubmission(req, res) {
    try {
        const id = Number(req.params.id);
        const { title, url } = req.body || {};

        const submission = await submissionService.updateSubmission(
            id,
            { title, url },
            req.user
        );

        return res.status(200).json(submission);
    } catch (error) {
        return handleError(res, error, 'atualizar');
    }
}

// Aprova ou rejeita uma submissão
async function moderateSubmission(req, res) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body || {};

        const submission = await submissionService.moderateSubmission(
            id,
            status,
            req.user
        );

        return res.status(200).json(submission);
    } catch (error) {
        return handleError(res, error, 'moderar');
    }
}

// Exclui uma submissão pendente
async function deleteSubmission(req, res) {
    try {
        const id = Number(req.params.id);

        await submissionService.deleteSubmission(id, req.user);

        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'excluir');
    }
}

module.exports = {
    createSubmission,
    listSubmissions,
    getSubmissionById,
    listSubmissionsByUser,
    listSubmissionsByTopic,
    listSubmissionsByStatus,
    updateSubmission,
    moderateSubmission,
    deleteSubmission
};
