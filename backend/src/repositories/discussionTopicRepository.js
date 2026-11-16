
// discussionTopicRepository.js => Realiza as operações dos tópicos de discussão no MySQL.

const prisma = require('../config/prisma');

// Cadastra um novo tópico de discussão
async function create(data) {
    return prisma.discussionTopic.create({
        data
    });
}

// Lista todos os tópicos de discussão
async function findAll() {
    return prisma.discussionTopic.findMany({
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
        }
    });
}

// Lista os tópicos criados por um usuário
async function findByUserId(userId) {
    return prisma.discussionTopic.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

// Atualiza um tópico de discussão
async function update(id, data) {
    return prisma.discussionTopic.update({
        where: {
            id
        },
        data
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
    update,
    remove
};
