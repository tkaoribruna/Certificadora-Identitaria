
// communitySubmissionRepository.js => Realiza as operações das submissões da comunidade no MySQL.

const prisma = require('../config/prisma');

// Cadastra uma nova submissão
async function create(data) {
    return prisma.communitySubmission.create({
        data
    });
}

// Lista submissões conforme as permissões do usuário
async function findAll(user) {
    return prisma.communitySubmission.findMany({
        where: user.role === 'ADMIN'
            ? {}
            : {
                OR: [
                    { status: 'APPROVED' },
                    { userId: user.id }
                ]
            },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Busca uma submissão pelo ID
async function findById(id) {
    return prisma.communitySubmission.findUnique({
        where: {
            id
        }
    });
}

// Lista as submissões de um usuário
async function findByUserId(userId) {
    return prisma.communitySubmission.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Lista submissões de um tópico conforme as permissões
async function findByTopicId(discussionTopicId, user) {
    return prisma.communitySubmission.findMany({
        where: {
            discussionTopicId,
            ...(user.role === 'ADMIN'
                ? {}
                : {
                    OR: [
                        { status: 'APPROVED' },
                        { userId: user.id }
                    ]
                })
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Lista submissões por status
async function findByStatus(status) {
    return prisma.communitySubmission.findMany({
        where: {
            status
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Atualiza uma submissão
async function update(id, data) {
    return prisma.communitySubmission.update({
        where: {
            id
        },
        data
    });
}

// Exclui uma submissão
async function remove(id) {
    return prisma.communitySubmission.delete({
        where: {
            id
        }
    });
}

module.exports = {
    create,
    findAll,
    findById,
    findByUserId,
    findByTopicId,
    findByStatus,
    update,
    remove
};
