
// communitySubmissionService.js => Aplica as regras de negócio e moderação das submissões da comunidade.

const submissionRepository = require('../repositories/communitySubmissionRepository');
const topicRepository = require('../repositories/discussionTopicRepository');

const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

function validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID inválido.');
    }
}

function validateSubmissionData(title, url) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof url !== 'string' ||
        !url.trim()
    ) {
        throw new Error('Título e URL são obrigatórios.');
    }

    try {
        const parsedUrl = new URL(url.trim());

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error();
        }
    } catch {
        throw new Error('URL inválida.');
    }
}

function validateUser(user) {
    if (
        !user ||
        !Number.isInteger(user.id) ||
        !['STUDENT', 'ADMIN'].includes(user.role)
    ) {
        throw new Error('Usuário inválido.');
    }
}

async function ensureTopicExists(topicId) {
    validateId(topicId);

    const topic = await topicRepository.findById(topicId);

    if (!topic) {
        throw new Error('Tópico não encontrado.');
    }
}

async function createSubmission({ title, url, discussionTopicId, userId }) {
    validateSubmissionData(title, url);
    validateId(userId);

    await ensureTopicExists(discussionTopicId);

    return submissionRepository.create({
        title: title.trim(),
        url: url.trim(),
        discussionTopicId,
        userId,
        status: 'PENDING'
    });
}

// ADMIN visualiza todas; STUDENT visualiza aprovadas e próprias
async function listSubmissions(user) {
    validateUser(user);
    return submissionRepository.findAll(user);
}

// ADMIN visualiza qualquer submissão;
// STUDENT visualiza somente aprovadas ou próprias
async function getSubmissionById(id, user) {
    validateId(id);

    const submission = await submissionRepository.findById(id);

    if (!submission) {
        throw new Error('Submissão não encontrada.');
    }

    if (user) {
        validateUser(user);

        if (
            user.role !== 'ADMIN' &&
            submission.userId !== user.id &&
            submission.status !== 'APPROVED'
        ) {
            throw new Error('Você não tem permissão para visualizar esta submissão.');
        }
    }

    return submission;
}

// ADMIN consulta qualquer usuário; STUDENT somente a si mesmo
async function listSubmissionsByUser(userId, user) {
    validateId(userId);
    validateUser(user);

    if (user.role !== 'ADMIN' && user.id !== userId) {
        throw new Error('Você não tem permissão para visualizar estas submissões.');
    }

    return submissionRepository.findByUserId(userId);
}

// ADMIN visualiza todas do tópico;
// STUDENT visualiza aprovadas e próprias
async function listSubmissionsByTopic(topicId, user) {
    validateUser(user);
    await ensureTopicExists(topicId);

    return submissionRepository.findByTopicId(topicId, user);
}

// Consulta por status reservada aos administradores
async function listSubmissionsByStatus(status) {
    if (!VALID_STATUSES.includes(status)) {
        throw new Error('Status inválido.');
    }

    return submissionRepository.findByStatus(status);
}

// ADMIN ou autor pode editar, somente enquanto PENDING
async function updateSubmission(id, { title, url }, user) {
    validateUser(user);
    validateSubmissionData(title, url);

    const submission = await getSubmissionById(id);

    if (user.role !== 'ADMIN' && submission.userId !== user.id) {
        throw new Error('Você não tem permissão para alterar esta submissão.');
    }

    if (submission.status !== 'PENDING') {
        throw new Error('Somente submissões pendentes podem ser alteradas.');
    }

    return submissionRepository.update(id, {
        title: title.trim(),
        url: url.trim()
    });
}

// Somente ADMIN pode aprovar ou rejeitar
async function moderateSubmission(id, status, user) {
    validateUser(user);

    if (user.role !== 'ADMIN') {
        throw new Error('Somente administradores podem moderar submissões.');
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        throw new Error('Status de moderação inválido.');
    }

    const submission = await getSubmissionById(id);

    if (submission.status !== 'PENDING') {
        throw new Error('Esta submissão já foi moderada.');
    }

    return submissionRepository.update(id, {
        status,
        moderatorId: user.id
    });
}

// ADMIN ou autor pode excluir, somente enquanto PENDING
async function deleteSubmission(id, user) {
    validateUser(user);

    const submission = await getSubmissionById(id);

    if (user.role !== 'ADMIN' && submission.userId !== user.id) {
        throw new Error('Você não tem permissão para excluir esta submissão.');
    }

    if (submission.status !== 'PENDING') {
        throw new Error('Somente submissões pendentes podem ser excluídas.');
    }

    return submissionRepository.remove(id);
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
