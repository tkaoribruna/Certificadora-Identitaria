// visibility.js => Define quem pode enxergar conteúdo conforme o status de moderação.
//
// APPROVED  -> todos
// PENDING   -> apenas o autor e os administradores
// REJECTED  -> apenas os administradores

function isAdmin(user) {
    return Boolean(user) && user.role === 'ADMIN';
}

// Filtro (Prisma "where") com o que o usuário pode ver
function visibilityWhere(user) {
    if (isAdmin(user)) {
        return {};
    }

    const conditions = [{ moderationStatus: 'APPROVED' }];

    if (user) {
        conditions.push({ moderationStatus: 'PENDING', userId: user.id });
    }

    return { OR: conditions };
}

// Verifica, em memória, se o usuário pode ver um registro
function canView(record, user) {
    if (!record) return false;
    if (isAdmin(user)) return true;
    if (record.moderationStatus === 'APPROVED') return true;

    return (
        record.moderationStatus === 'PENDING' &&
        Boolean(user) &&
        record.userId === user.id
    );
}

// Remove o motivo da moderação de quem não é o autor nem administrador
function present(record, user) {
    if (!record) return record;

    const allowed = isAdmin(user) || (user && record.userId === user.id);

    if (allowed || !('moderationReason' in record)) {
        return record;
    }

    const { moderationReason, ...rest } = record;
    return rest;
}

function presentMany(records, user) {
    return records.map((record) => present(record, user));
}

module.exports = {
    isAdmin,
    visibilityWhere,
    canView,
    present,
    presentMany
};
