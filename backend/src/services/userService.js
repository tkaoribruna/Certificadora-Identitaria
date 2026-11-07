
// userService.js

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

async function createUser({ name, email, password }) {
    // Verifica se todos os campos foram informados
    if (!name || !email || !password) {
        throw new Error('Nome, e-mail e senha são obrigatórios.');
    }

    // Verifica se o e-mail já está cadastrado
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error('Este e-mail já está cadastrado.');
    }

    // Gera o hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Cadastra o usuário com o perfil STUDENT
    const user = await userRepository.create({
        name,
        email,
        passwordHash,
        role: 'STUDENT'
    });

    // Retorna apenas os dados públicos do usuário
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

// Autentica um usuário pelo e-mail e senha
async function loginUser({ email, password }) {
    // Verifica se os campos foram informados
    if (!email || !password) {
        throw new Error('E-mail e senha são obrigatórios.');
    }

    // Busca o usuário no banco de dados
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error('E-mail ou senha inválidos.');
    }

    // Compara a senha informada com o hash armazenado
    const validPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!validPassword) {
        throw new Error('E-mail ou senha inválidos.');
    }

    // Retorna os dados públicos do usuário autenticado
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

module.exports = {
    createUser,
    loginUser
};
