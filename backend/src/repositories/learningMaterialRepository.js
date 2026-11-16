
// learningMaterialRepository.js => Realiza as operações dos materiais de aprendizagem no MySQL.

const prisma = require('../config/prisma');

// Cadastra um novo material
async function create(data) {
    return prisma.learningMaterial.create({
        data
    });
}

// Lista todos os materiais
async function findAll() {
    return prisma.learningMaterial.findMany({
        orderBy: {
            id: 'asc'
        }
    });
}

// Busca um material pelo ID
async function findById(id) {
    return prisma.learningMaterial.findUnique({
        where: {
            id
        }
    });
}

// Lista os materiais de um módulo específico
async function findByModuleId(moduleId) {
    return prisma.learningMaterial.findMany({
        where: {
            moduleId
        },
        orderBy: {
            id: 'asc'
        }
    });
}

// Atualiza um material
async function update(id, data) {
    return prisma.learningMaterial.update({
        where: {
            id
        },
        data
    });
}

// Exclui um material
async function remove(id) {
    return prisma.learningMaterial.delete({
        where: {
            id
        }
    });
}

module.exports = {
    create,
    findAll,
    findById,
    findByModuleId,
    update,
    remove
};
