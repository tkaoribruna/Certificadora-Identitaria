
// moduleService.js => Aplica as validações e regras de negócio dos módulos de ensino.

const moduleRepository = require('../repositories/moduleRepository');

// Valida o ID de um módulo
function validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID do módulo inválido.');
    }
}

// Valida os dados de um módulo
function validateModuleData(title, description) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof description !== 'string' ||
        !description.trim()
    ) {
        throw new Error('Título e descrição são obrigatórios.');
    }
}

// Cadastra um novo módulo
async function createModule({ title, description, userId }) {
    validateModuleData(title, description);

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
    validateId(id);

    const module = await moduleRepository.findById(id);

    if (!module) {
        throw new Error('Módulo não encontrado.');
    }

    return module;
}

// Atualiza um módulo existente
async function updateModule(id, { title, description }) {
    validateId(id);
    validateModuleData(title, description);

    await getModuleById(id);

    return moduleRepository.update(id, {
        title: title.trim(),
        description: description.trim()
    });
}

// Exclui um módulo existente
async function deleteModule(id) {
    validateId(id);

    await getModuleById(id);

    try {
        return await moduleRepository.remove(id);
    } catch (error) {
        if (error.code === 'P2003') {
            throw new Error(
                'Não é possível excluir um módulo que possui materiais vinculados.'
            );
        }

        throw error;
    }
}

module.exports = {
    createModule,
    listModules,
    getModuleById,
    updateModule,
    deleteModule
};
