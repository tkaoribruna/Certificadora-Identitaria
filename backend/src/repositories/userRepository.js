
const prisma = require('../config/prisma');

// Busca um usuário pelo e-mail
async function findByEmail(email) {
    return prisma.user.findUnique({
        where: { email }
    });
}

// Busca um usuário pelo ID
async function findById(id) {
    return prisma.user.findUnique({
        where: { id }
    });
}

// Cadastra um novo usuário
async function create(data) {
    return prisma.user.create({
        data
    });
}

module.exports = {
    findByEmail,
    findById,
    create
};
