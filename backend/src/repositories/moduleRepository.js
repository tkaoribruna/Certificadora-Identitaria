
// moduleRepository.js => Realiza as operações de cadastro, consulta, atualização e exclusão dos módulos no MySQL.

const prisma = require('../config/prisma');

// Cadastra um novo módulo
async function create(data) {
    return prisma.module.create({
        data
    });
}

// Lista todos os módulos cadastrados
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
        where: {
            id
        }
    });
}

// Atualiza os dados de um módulo
async function update(id, data) {
    return prisma.module.update({
        where: {
            id
        },
        data
    });
}

// Exclui um módulo
async function remove(id) {
    return prisma.module.delete({
        where: {
            id
        }
    });
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};
