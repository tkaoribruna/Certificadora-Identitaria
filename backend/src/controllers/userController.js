
// userController.js

const userService = require('../services/userService');
const tokenService = require('../services/tokenService');

// Controlador de cadastro
async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const user = await userService.createUser({
            name,
            email,
            password
        });

        return res.status(201).json(user);

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

// Controlador de login
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

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
        return res.status(401).json({
            error: 'E-mail ou senha inválidos.'
        });
    }
}

module.exports = {
    createUser,
    loginUser
};
