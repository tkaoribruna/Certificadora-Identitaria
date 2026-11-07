
// moduleRepository.js => Realiza operações de cadastro e consulta dos módulos no MySQL.

const prisma = require('../config/prisma');

// Cadastra um novo módulo
async function create(data) {
    return prisma.module.create({
        data
    });
}

// Lista todos os módulos
async function findAll() {
    return prisma.module.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

// Busca um módulo pelo ID
async function findById(id) {
    return prisma.module.findUnique({
        where: { id }
    });
}

module.exports = {
    create,
    findAll,
    findById
};
