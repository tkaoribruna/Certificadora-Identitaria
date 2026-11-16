
// learningMaterialController.js => Controla as requisições HTTP dos materiais de aprendizagem.

const learningMaterialService = require('../services/learningMaterialService');

// Identifica erros de validação e recursos não encontrados
function handleError(res, error, action) {
    const validationErrors = [
        'ID inválido.',
        'Título e URL são obrigatórios.',
        'Tipo de material inválido. Use VIDEO, SLIDE ou DOCUMENT.',
        'URL do material inválida.'
    ];

    if (validationErrors.includes(error.message)) {
        return res.status(400).json({
            error: error.message
        });
    }

    if (
        error.message === 'Material não encontrado.' ||
        error.message === 'Módulo não encontrado.'
    ) {
        return res.status(404).json({
            error: error.message
        });
    }

    if (
        error.message ===
        'Não é possível excluir um material que possui comentários vinculados.'
    ) {
        return res.status(409).json({
            error: error.message
        });
    }

    console.error(`Erro ao ${action} material:`, error);

    return res.status(500).json({
        error: 'Erro interno no servidor.'
    });
}

// Cadastra um novo material
async function createMaterial(req, res) {
    try {
        const { title, url, type, moduleId } = req.body;

        const material = await learningMaterialService.createMaterial({
            title,
            url,
            type,
            moduleId
        });

        return res.status(201).json(material);
    } catch (error) {
        return handleError(res, error, 'cadastrar');
    }
}

// Lista todos os materiais
async function listMaterials(req, res) {
    try {
        const materials = await learningMaterialService.listMaterials();

        return res.status(200).json(materials);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Busca um material pelo ID
async function getMaterialById(req, res) {
    try {
        const id = Number(req.params.id);

        const material = await learningMaterialService.getMaterialById(id);

        return res.status(200).json(material);
    } catch (error) {
        return handleError(res, error, 'buscar');
    }
}

// Lista os materiais de um módulo específico
async function listMaterialsByModule(req, res) {
    try {
        const moduleId = Number(req.params.moduleId);

        const materials = await learningMaterialService.listMaterialsByModule(
            moduleId
        );

        return res.status(200).json(materials);
    } catch (error) {
        return handleError(res, error, 'listar');
    }
}

// Atualiza um material
async function updateMaterial(req, res) {
    try {
        const id = Number(req.params.id);
        const { title, url, type, moduleId } = req.body;

        const material = await learningMaterialService.updateMaterial(id, {
            title,
            url,
            type,
            moduleId
        });

        return res.status(200).json(material);
    } catch (error) {
        return handleError(res, error, 'atualizar');
    }
}

// Exclui um material
async function deleteMaterial(req, res) {
    try {
        const id = Number(req.params.id);

        await learningMaterialService.deleteMaterial(id);

        return res.status(204).send();
    } catch (error) {
        return handleError(res, error, 'excluir');
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
