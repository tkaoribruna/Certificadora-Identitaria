
// userService.js => Valida os dados, cadastra usuários e autentica senhas com bcrypt.

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

// Cria um erro com código para o controller identificar
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Cadastra um novo usuário
async function createUser({ name, email, password }) {
    // Valida os tipos e os campos obrigatórios
    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        throw createError('Nome, e-mail e senha são obrigatórios.', 400);
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Valida o formato básico do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        throw createError('Formato de e-mail inválido.', 400);
    }

    // Exige uma senha com pelo menos 8 caracteres
    if (password.length < 8) {
        throw createError('A senha deve possuir pelo menos 8 caracteres.', 400);
    }

    // Verifica se o e-mail já está cadastrado
    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
        throw createError('Este e-mail já está cadastrado.', 409);
    }

    // Gera o hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    let user;

    try {
        // Todo usuário cadastrado publicamente recebe o perfil STUDENT
        user = await userRepository.create({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
            role: 'STUDENT'
        });
    } catch (error) {
        // Trata a tentativa simultânea de cadastrar o mesmo e-mail
        if (error.code === 'P2002') {
            throw createError('Este e-mail já está cadastrado.', 409);
        }

        throw error;
    }

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
    // Valida os tipos recebidos
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        throw createError('E-mail e senha são obrigatórios.', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Busca o usuário no banco de dados
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
        throw createError('E-mail ou senha inválidos.', 401);
    }

    // Compara a senha informada com o hash armazenado
    const validPassword = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!validPassword) {
        throw createError('E-mail ou senha inválidos.', 401);
    }

    // Retorna apenas os dados públicos do usuário
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
