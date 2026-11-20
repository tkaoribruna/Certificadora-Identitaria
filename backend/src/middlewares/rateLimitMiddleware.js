// rateLimitMiddleware.js => Limita quantas publicações cada usuário pode fazer por minuto.
// Protege contra spam e evita esgotar a cota gratuita da IA. Os contadores ficam em memória.

function createRateLimiter({ windowMs = 60 * 1000, max = 6, message } = {}) {
    const hits = new Map();

    return function rateLimit(req, res, next) {
        const key = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
        const now = Date.now();

        const recent = (hits.get(key) || []).filter((time) => now - time < windowMs);

        if (recent.length >= max) {
            const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);

            res.set('Retry-After', String(retryAfter));

            return res.status(429).json({
                error:
                    message ||
                    `Você está publicando rápido demais. Tente novamente em ${retryAfter} segundos.`
            });
        }

        recent.push(now);
        hits.set(key, recent);

        // Limpeza ocasional para não acumular chaves antigas
        if (hits.size > 5000) {
            for (const [k, times] of hits) {
                if (times.every((time) => now - time >= windowMs)) hits.delete(k);
            }
        }

        next();
    };
}

// Limite padrão para criar ou editar tópicos e comentários
const postingLimiter = createRateLimiter({
    max: Number(process.env.POST_RATE_LIMIT_PER_MIN) || 6
});

module.exports = { createRateLimiter, postingLimiter };
