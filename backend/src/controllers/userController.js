
// userController.js => Controla o cadastro e login, retornando os códigos HTTP adequados.

const userService = require('../services/userService');
const tokenService = require('../services/tokenService');

// Controlador de cadastro
async function createUser(req, res) {
    try {
        const { name, email, password } = req.body || {};

        const user = await userService.createUser({
            name,
            email,
            password
        });

        return res.status(201).json(user);

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro interno no cadastro:', error);

        return res.status(500).json({
            error: 'Erro interno ao cadastrar usuário.'
        });
    }
}

// Controlador de login
async function loginUser(req, res) {
    try {
        const { email, password } = req.body || {};

        const user = await userService.loginUser({
            email,
            password
        });

        // Gera um token JWT para o usuário autenticado
        const token = tokenService.generateToken(user);

        return res.status(200).json({
            user,
            token
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error('Erro interno no login:', error);

        return res.status(500).json({
            error: 'Erro interno ao realizar login.'
        });
    }
}

module.exports = {
    createUser,
    loginUser
};
