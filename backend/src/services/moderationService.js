// moderationService.js => Decide se um tópico ou comentário pode ser publicado.
//
// Fluxo:
//   1. Regras locais (moderationRules). Se BLOCK, rejeita sem consultar a IA.
//   2. IA (aiModerationService), se houver GEMINI_API_KEY.
//      Se a IA falhar, o conteúdo vai para análise manual (nunca é publicado "no escuro").
//   3. O resultado final é o mais restritivo entre as duas camadas.
//
// Resultado: { decision: ALLOW|REVIEW|BLOCK, status: APPROVED|PENDING|REJECTED, reason, source }

const rules = require('./moderationRules');
const aiModeration = require('./aiModerationService');

const SEVERITY = { ALLOW: 0, REVIEW: 1, BLOCK: 2 };

const STATUS = {
    ALLOW: 'APPROVED',
    REVIEW: 'PENDING',
    BLOCK: 'REJECTED'
};

function build(decision, reason, source, category = 'none') {
    return {
        decision,
        status: STATUS[decision],
        reason: reason ? String(reason).slice(0, 500) : null,
        source,
        category
    };
}

function log(kind, result) {
    // Nunca registra o texto do usuário, apenas o resultado
    console.log(
        `[moderação] tipo=${kind} decisão=${result.decision} origem=${result.source} categoria=${result.category}`
    );
}

async function moderate({ kind, text }) {
    // 1) Regras locais
    const ruleResult = rules.check(text);

    if (ruleResult.decision === 'BLOCK') {
        const result = build('BLOCK', ruleResult.message, 'regras', ruleResult.flags[0].id);
        log(kind, result);
        return result;
    }

    // 2) IA (opcional)
    let aiResult = null;
    let aiFailed = false;

    if (aiModeration.isConfigured()) {
        try {
            aiResult = await aiModeration.classify({ kind, text });
        } catch (error) {
            aiFailed = true;
            console.error('[moderação] Falha na IA, o conteúdo irá para revisão:', error.message);
        }
    }

    // 3) Combina: vale a decisão mais restritiva
    let result;

    if (aiFailed) {
        const decision = ruleResult.decision === 'ALLOW' ? 'REVIEW' : ruleResult.decision;
        result = build(
            decision,
            ruleResult.message || 'A análise automática está indisponível; o conteúdo aguarda revisão.',
            'fallback'
        );
    } else if (aiResult) {
        const decision =
            SEVERITY[aiResult.decision] >= SEVERITY[ruleResult.decision]
                ? aiResult.decision
                : ruleResult.decision;

        const fromAi = SEVERITY[aiResult.decision] >= SEVERITY[ruleResult.decision];

        result = build(
            decision,
            decision === 'ALLOW' ? null : (fromAi ? aiResult.reason : ruleResult.message) || ruleResult.message,
            ruleResult.decision !== 'ALLOW' && aiResult.decision !== 'ALLOW' ? 'regras+ia' : fromAi ? 'ia' : 'regras',
            aiResult.category
        );
    } else {
        // IA desligada: valem apenas as regras locais
        result = build(
            ruleResult.decision,
            ruleResult.message,
            'regras',
            ruleResult.flags[0] ? ruleResult.flags[0].id : 'none'
        );
    }

    log(kind, result);
    return result;
}

function describeSetup() {
    return aiModeration.isConfigured()
        ? 'regras locais + IA (Gemini)'
        : 'somente regras locais (defina GEMINI_API_KEY para ativar a IA)';
}

module.exports = { moderate, describeSetup, STATUS };
