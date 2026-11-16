
// learningMaterialService.js => Aplica as validações e regras de negócio dos materiais de aprendizagem.

const learningMaterialRepository = require('../repositories/learningMaterialRepository');
const moduleRepository = require('../repositories/moduleRepository');

const VALID_TYPES = ['VIDEO', 'SLIDE', 'DOCUMENT'];

// Valida IDs recebidos pela API
function validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID inválido.');
    }
}

// Valida os dados de um material
function validateMaterialData({ title, url, type, moduleId }) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof url !== 'string' ||
        !url.trim()
    ) {
        throw new Error('Título e URL são obrigatórios.');
    }

    if (!VALID_TYPES.includes(type)) {
        throw new Error('Tipo de material inválido. Use VIDEO, SLIDE ou DOCUMENT.');
    }

    validateId(moduleId);

    try {
        const parsedUrl = new URL(url);

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error();
        }
    } catch (error) {
        throw new Error('URL do material inválida.');
    }
}

// Verifica se o módulo existe
async function ensureModuleExists(moduleId) {
    const module = await moduleRepository.findById(moduleId);

    if (!module) {
        throw new Error('Módulo não encontrado.');
    }
}

// Cadastra um material
async function createMaterial({ title, url, type, moduleId }) {
    validateMaterialData({ title, url, type, moduleId });
    await ensureModuleExists(moduleId);

    return learningMaterialRepository.create({
        title: title.trim(),
        url: url.trim(),
        type,
        moduleId
    });
}

// Lista todos os materiais
async function listMaterials() {
    return learningMaterialRepository.findAll();
}

// Busca um material pelo ID
async function getMaterialById(id) {
    validateId(id);

    const material = await learningMaterialRepository.findById(id);

    if (!material) {
        throw new Error('Material não encontrado.');
    }

    return material;
}

// Lista os materiais de um módulo
async function listMaterialsByModule(moduleId) {
    validateId(moduleId);
    await ensureModuleExists(moduleId);

    return learningMaterialRepository.findByModuleId(moduleId);
}

// Atualiza um material
async function updateMaterial(id, { title, url, type, moduleId }) {
    validateId(id);
    validateMaterialData({ title, url, type, moduleId });

    await getMaterialById(id);
    await ensureModuleExists(moduleId);

    return learningMaterialRepository.update(id, {
        title: title.trim(),
        url: url.trim(),
        type,
        moduleId
    });
}

// Exclui um material
async function deleteMaterial(id) {
    validateId(id);
    await getMaterialById(id);

    try {
        return await learningMaterialRepository.remove(id);
    } catch (error) {
        if (error.code === 'P2003') {
            throw new Error(
                'Não é possível excluir um material que possui comentários vinculados.'
            );
        }

        throw error;
    }
}

module.exports = {
    createMaterial,
    listMaterials,
    getMaterialById,
    listMaterialsByModule,
    updateMaterial,
    deleteMaterial
};
