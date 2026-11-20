
// commentRepository.js => Realiza as operações dos comentários no MySQL.

const prisma = require('../config/prisma');

// Inclui o nome do autor em cada comentário
const commentInclude = {
    user: {
        select: { id: true, name: true }
    }
};

// Cadastra um novo comentário
async function create(data) {
    return prisma.comment.create({
        data,
        include: commentInclude
    });
}

// Lista os comentários (o filtro de visibilidade vem do service)
async function findAll(where = {}) {
    return prisma.comment.findMany({
        where,
        include: commentInclude,
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Busca um comentário pelo ID
async function findById(id) {
    return prisma.comment.findUnique({
        where: {
            id
        },
        include: commentInclude
    });
}

// Lista os comentários de um material de aprendizagem
async function findByMaterialId(learningMaterialId, where = {}) {
    return prisma.comment.findMany({
        where: {
            AND: [{ learningMaterialId }, where]
        },
        include: commentInclude,
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Lista os comentários de um tópico de discussão
async function findByTopicId(discussionTopicId, where = {}) {
    return prisma.comment.findMany({
        where: {
            AND: [{ discussionTopicId }, where]
        },
        include: commentInclude,
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Lista os comentários com um determinado status de moderação (fila do administrador)
async function findByModerationStatus(moderationStatus) {
    return prisma.comment.findMany({
        where: {
            moderationStatus
        },
        include: {
            ...commentInclude,
            discussionTopic: {
                select: { id: true, title: true }
            },
            learningMaterial: {
                select: { id: true, title: true }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Atualiza um comentário
async function update(id, data) {
    return prisma.comment.update({
        where: {
            id
        },
        data,
        include: commentInclude
    });
}

// Exclui um comentário
async function remove(id) {
    return prisma.comment.delete({
        where: {
            id
        }
    });
}

module.exports = {
    create,
    findAll,
    findById,
    findByMaterialId,
    findByTopicId,
    findByModerationStatus,
    update,
    remove
};
