
// moduleController.js => Controla as requisições HTTP de cadastro, consulta, atualização e exclusão dos módulos.

const moduleService = require('../services/moduleService');

// Cadastra um novo módulo
async function createModule(req, res) {
    try {
        const { title, description } = req.body;

        const module = await moduleService.createModule({
            title,
            description,
            userId: req.user.id
        });

        return res.status(201).json(module);
    } catch (error) {
        if (error.message === 'Título e descrição são obrigatórios.') {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: 'Erro interno ao cadastrar o módulo.'
        });
    }
}

// Lista todos os módulos
async function listModules(req, res) {
    try {
        const modules = await moduleService.listModules();

        return res.status(200).json(modules);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro interno ao listar os módulos.'
        });
    }
}

// Busca um módulo pelo ID
async function getModuleById(req, res) {
    try {
        const id = Number(req.params.id);
        const module = await moduleService.getModuleById(id);

        return res.status(200).json(module);
    } catch (error) {
        if (error.message === 'ID do módulo inválido.') {
            return res.status(400).json({
                error: error.message
            });
        }

        if (error.message === 'Módulo não encontrado.') {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: 'Erro interno ao buscar o módulo.'
        });
    }
}

// Atualiza um módulo
async function updateModule(req, res) {
    try {
        const id = Number(req.params.id);
        const { title, description } = req.body;

        const module = await moduleService.updateModule(id, {
            title,
            description
        });

        return res.status(200).json(module);
    } catch (error) {
        if (
            error.message === 'ID do módulo inválido.' ||
            error.message === 'Título e descrição são obrigatórios.'
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (error.message === 'Módulo não encontrado.') {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: 'Erro interno ao atualizar o módulo.'
        });
    }
}

// Exclui um módulo
async function deleteModule(req, res) {
    try {
        const id = Number(req.params.id);

        await moduleService.deleteModule(id);

        return res.status(204).send();
    } catch (error) {
        if (error.message === 'ID do módulo inválido.') {
            return res.status(400).json({
                error: error.message
            });
        }

        if (error.message === 'Módulo não encontrado.') {
            return res.status(404).json({
                error: error.message
            });
        }

        if (
            error.message ===
            'Não é possível excluir um módulo que possui materiais vinculados.'
        ) {
            return res.status(409).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: 'Erro interno ao excluir o módulo.'
        });
    }
}

module.exports = {
    createModule,
    listModules,
    getModuleById,
    updateModule,
    deleteModule
};
