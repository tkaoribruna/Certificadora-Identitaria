
// discussionTopicRepository.js => Realiza as operações dos tópicos de discussão no MySQL.

const prisma = require('../config/prisma');

// Dados extras enviados junto com cada tópico (autor e número de respostas aprovadas)
const topicInclude = {
    user: {
        select: { id: true, name: true }
    },
    _count: {
        select: {
            comments: { where: { moderationStatus: 'APPROVED' } }
        }
    }
};

// Cadastra um novo tópico de discussão
async function create(data) {
    return prisma.discussionTopic.create({
        data,
        include: topicInclude
    });
}

// Lista os tópicos (o filtro de visibilidade vem do service)
async function findAll(where = {}) {
    return prisma.discussionTopic.findMany({
        where,
        include: topicInclude,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Busca um tópico pelo ID
async function findById(id) {
    return prisma.discussionTopic.findUnique({
        where: {
            id
        },
        include: topicInclude
    });
}

// Lista os tópicos criados por um usuário
async function findByUserId(userId, where = {}) {
    return prisma.discussionTopic.findMany({
        where: {
            AND: [{ userId }, where]
        },
        include: topicInclude,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Lista os tópicos com um determinado status de moderação (fila do administrador)
async function findByModerationStatus(moderationStatus) {
    return prisma.discussionTopic.findMany({
        where: {
            moderationStatus
        },
        include: topicInclude,
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Atualiza um tópico de discussão
async function update(id, data) {
    return prisma.discussionTopic.update({
        where: {
            id
        },
        data,
        include: topicInclude
    });
}

// Exclui um tópico de discussão
async function remove(id) {
    return prisma.discussionTopic.delete({
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
    findByModerationStatus,
    update,
    remove
};
