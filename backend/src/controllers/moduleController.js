
// moduleController.js => Controla as requisições HTTP relacionadas aos módulos de ensino.

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
        return res.status(400).json({
            error: error.message
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

module.exports = {
    createModule,
    listModules,
    getModuleById
};
