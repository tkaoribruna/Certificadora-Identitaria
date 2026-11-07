
// moduleService.js => Aplica as regras de negócio dos módulos de ensino.

const moduleRepository = require('../repositories/moduleRepository');

// Cadastra um novo módulo
async function createModule({ title, description, userId }) {
    // Verifica os campos obrigatórios
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof description !== 'string' ||
        !description.trim()
    ) {
        throw new Error('Título e descrição são obrigatórios.');
    }

    // Cadastra o módulo vinculado ao usuário responsável
    return moduleRepository.create({
        title: title.trim(),
        description: description.trim(),
        userId
    });
}

// Lista todos os módulos
async function listModules() {
    return moduleRepository.findAll();
}

// Busca um módulo pelo ID
async function getModuleById(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID do módulo inválido.');
    }

    const module = await moduleRepository.findById(id);

    if (!module) {
        throw new Error('Módulo não encontrado.');
    }

    return module;
}

module.exports = {
    createModule,
    listModules,
    getModuleById
};
