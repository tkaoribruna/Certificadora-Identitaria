// moderationRules.js => Primeira camada de moderação: regras locais, gratuitas e instantâneas.
//
// Cada regra tem uma gravidade:
//   BLOCK  -> rejeita na hora (spam evidente, chaves privadas vazadas).
//   REVIEW -> não publica automaticamente; vai para a fila de um administrador,
//             mesmo que a IA considere o texto seguro. Serve de "cinto de segurança"
//             caso alguém tente enganar o modelo de IA.
//
// Para ajustar a moderação, basta editar a lista RULES abaixo.

// Remove acentos, deixa em minúsculas e junta espaços para facilitar a busca
function normalize(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ');
}

const URL_REGEX = /https?:\/\/[^\s)>\]]+|www\.[^\s)>\]]+/gi;

const SHORTENERS = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'is.gd',
    'rb.gy', 'shorturl.at', 'ow.ly', 'tiny.cc', 'buff.ly', 'rebrand.ly'
];

const EXECUTABLE_URL = /https?:\/\/[^\s]+\.(exe|scr|bat|cmd|msi|apk|ps1|vbs|jar|dmg|iso)(\?[^\s]*)?(\s|$)/i;

// Regras baseadas em padrões. "pattern" é testado no texto normalizado (sem acentos).
const RULES = [
    // ---------- BLOCK ----------
    {
        id: 'private_key',
        severity: 'BLOCK',
        message: 'O texto parece conter uma chave privada ou credencial. Remova-a antes de publicar.',
        pattern: /-----begin ((rsa|ec|dsa|openssh|pgp) )?private key( block)?-----|\bakia[0-9a-z]{16}\b/i
    },
    {
        id: 'flood',
        severity: 'BLOCK',
        message: 'O texto contém repetições excessivas e parece spam.',
        pattern: /([^\s\-=_*#.~])\1{29,}/
    },

    // ---------- REVIEW ----------
    {
        id: 'destructive_command',
        severity: 'REVIEW',
        message: 'Contém um comando potencialmente destrutivo.',
        pattern: /rm\s+-[a-z]*r[a-z]*f?[a-z]*\s+(\/|~|\*|\$home)|:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:|\bmkfs(\.\w+)?\s+\/dev\/|dd\s+if=\/dev\/(zero|random|urandom)\s+of=\/dev\/|format\s+c:|del\s+\/[fsq]\s+.*c:\\|chmod\s+-r\s+777\s+\//i
    },
    {
        id: 'remote_exec',
        severity: 'REVIEW',
        message: 'Contém execução de código baixado da internet ou comando ofuscado.',
        pattern: /(curl|wget)\s[^|\n]{0,200}\|\s*(sudo\s+)?(ba|z|da)?sh\b|base64\s+(-d|--decode)[^|\n]{0,80}\|\s*(ba|z)?sh\b|powershell[^\n]{0,80}\s-(e|enc|encodedcommand)\b|\biex\s*\(|invoke-expression|downloadstring\s*\(/i
    },
    {
        id: 'disable_protection',
        severity: 'REVIEW',
        message: 'Menciona desativar proteções de segurança.',
        pattern: /(desativ|desabilit|desligu|disable|turn off|stop)\w*\s.{0,40}(antiviru|antivirus|firewall|defender|\buac\b|selinux|autenticacao (em|de) (dois|2)|\b2fa\b|\bmfa\b|atualizacoes automaticas|windows update)/i
    },
    {
        id: 'credential_request',
        severity: 'REVIEW',
        message: 'Parece pedir ou incentivar o envio de senhas ou códigos.',
        pattern: /(me\s)?(passe|passa|envie|envia|mande|manda|compartilhe|compartilha|send|give)\s.{0,25}(sua|tua|a|your|suas|tuas)\s(senha|password|token|codigo de verificacao|codigo sms|chave|credencia)/i
    },
    {
        id: 'unauthorized_target',
        severity: 'REVIEW',
        message: 'Parece pedir ajuda para invadir ou espionar outra pessoa.',
        pattern: /(hackear|hackeia|invadir|invadi|clonar|espionar|rastrear|monitorar escondido|stalkear)\s.{0,50}(\bex\b|namorad|espos|marid|vizinh|colega|chefe|outra pessoa|alguem|conta d[aoe])/i
    },
    {
        id: 'malware_distribution',
        severity: 'REVIEW',
        message: 'Menciona crack, keygen ou programas pirateados.',
        pattern: /\b(keygen|crackeado|crack para|baixar crack|ativador|warez|serial gratis|loader gratis)\b/i
    },
    {
        id: 'personal_data',
        severity: 'REVIEW',
        message: 'Parece conter dados pessoais (CPF ou cartão).',
        pattern: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b(?:\d{4}[ -]){3}\d{4}\b/
    },
    {
        id: 'prompt_injection',
        severity: 'REVIEW',
        message: 'Contém trechos que tentam manipular a moderação automática.',
        pattern: /(ignore|ignora|ignorar|desconsidere|esqueca|disregard|forget)\s.{0,40}(instruc|regras|instructions|rules|prompt|anteriores|previous)|system prompt|voce e (um|o) moderador|you are (a|the) moderator|responda\s.{0,15}\ballow\b|"decision"\s*:|<\/?conteudo_do_usuario>/i
    }
];

// Verificações que dependem de contagem (links)
function checkLinks(text) {
    const flags = [];
    const urls = text.match(URL_REGEX) || [];

    if (urls.length > 6) {
        flags.push({
            id: 'too_many_links',
            severity: 'BLOCK',
            message: 'Muitos links no mesmo texto. Isso parece spam.'
        });
    } else if (urls.length > 3) {
        flags.push({
            id: 'many_links',
            severity: 'REVIEW',
            message: 'Contém muitos links.'
        });
    }

    const lower = text.toLowerCase();

    if (SHORTENERS.some((domain) => lower.includes(`${domain}/`))) {
        flags.push({
            id: 'shortened_link',
            severity: 'REVIEW',
            message: 'Contém link encurtado, que esconde o destino real.'
        });
    }

    if (EXECUTABLE_URL.test(text)) {
        flags.push({
            id: 'executable_link',
            severity: 'REVIEW',
            message: 'Contém link para um arquivo executável.'
        });
    }

    return flags;
}

// Analisa o texto e devolve { decision, flags, message }
function check(text) {
    const normalized = normalize(text);
    const flags = [];

    for (const rule of RULES) {
        if (rule.pattern.test(normalized)) {
            flags.push({
                id: rule.id,
                severity: rule.severity,
                message: rule.message
            });
        }
    }

    flags.push(...checkLinks(text));

    const blocking = flags.find((flag) => flag.severity === 'BLOCK');
    const reviewing = flags.find((flag) => flag.severity === 'REVIEW');

    const decision = blocking ? 'BLOCK' : reviewing ? 'REVIEW' : 'ALLOW';
    const main = blocking || reviewing;

    return {
        decision,
        flags,
        message: main ? main.message : null
    };
}

module.exports = { check, normalize };
