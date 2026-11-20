// httpError.js => Cria erros com código HTTP para os controllers responderem corretamente.

function httpError(message, statusCode, extra = {}) {
    const error = new Error(message);
    error.statusCode = statusCode;
    Object.assign(error, extra);
    return error;
}

module.exports = httpError;
