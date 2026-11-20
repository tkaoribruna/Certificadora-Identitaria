
// moderationController.js => Fila de moderação: o administrador consulta, aprova ou rejeita conteúdos.

const discussionTopicRepository = require('../repositories/discussionTopicRepository');
const commentRepository = require('../repositories/commentRepository');

const QUEUE_STATUSES = ['PENDING', 'REJECTED'];
const DECISIONS = ['APPROVED', 'REJECTED'];

// Lista os conteúdos aguardando revisão (ou rejeitados)
async function getQueue(req, res) {
    try {
        const status = String(req.query.status || 'PENDING').toUpperCase();

        if (!QUEUE_STATUSES.includes(status)) {
            return res.status(400).json({
                error: 'Status inválido. Use PENDING ou REJECTED.'
            });
        }

        const [topics, comments] = await Promise.all([
            discussionTopicRepository.findByModerationStatus(status),
            commentRepository.findByModerationStatus(status)
        ]);

        return res.status(200).json({ topics, comments });
    } catch (error) {
        console.error('Erro ao consultar a fila de moderação:', error);

        return res.status(500).json({
            error: 'Erro interno no servidor.'
        });
    }
}

// Cria a função que aprova ou rejeita um tipo de conteúdo
function createModerationHandler(repository, notFoundMessage) {
    return async function handler(req, res) {
        try {
            const id = Number(req.params.id);
            const { decision, reason } = req.body || {};

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({ error: 'ID inválido.' });
            }

            if (!DECISIONS.includes(decision)) {
                return res.status(400).json({
                    error: 'A decisão deve ser APPROVED ou REJECTED.'
                });
            }

            if (reason !== undefined && typeof reason !== 'string') {
                return res.status(400).json({ error: 'Motivo inválido.' });
            }

            const record = await repository.findById(id);

            if (!record) {
                return res.status(404).json({ error: notFoundMessage });
            }

            const updated = await repository.update(id, {
                moderationStatus: decision,
                moderationReason:
                    decision === 'REJECTED'
                        ? (reason || 'Rejeitado por um administrador.').trim().slice(0, 500)
                        : null
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error('Erro ao moderar conteúdo:', error);

            return res.status(500).json({
                error: 'Erro interno no servidor.'
            });
        }
    };
}

module.exports = {
    getQueue,
    moderateTopic: createModerationHandler(discussionTopicRepository, 'Tópico não encontrado.'),
    moderateComment: createModerationHandler(commentRepository, 'Comentário não encontrado.')
};
