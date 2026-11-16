
// commentRepository.js => Realiza as operações dos comentários no MySQL.

const prisma = require('../config/prisma');

// Cadastra um novo comentário
async function create(data) {
    return prisma.comment.create({
        data
    });
}

// Lista todos os comentários
async function findAll() {
    return prisma.comment.findMany({
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
        }
    });
}

// Lista os comentários de um material de aprendizagem
async function findByMaterialId(learningMaterialId) {
    return prisma.comment.findMany({
        where: {
            learningMaterialId
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}

// Lista os comentários de um tópico de discussão
async function findByTopicId(discussionTopicId) {
    return prisma.comment.findMany({
        where: {
            discussionTopicId
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
        data
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
    update,
    remove
};
