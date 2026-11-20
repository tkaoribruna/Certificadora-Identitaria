# Como rodar o projeto

Você precisa de: **Node.js 20+** e **Docker** (ou um MySQL instalado).

## 1. Banco de dados (MySQL)

Na raiz do projeto:

```bash
docker compose up -d
```

Isso cria um MySQL na porta 3306 com o banco `cyberacademy`
(usuário `cyber`, senha `cyber123`). Sem Docker, crie esse mesmo
banco/usuário no seu MySQL ou ajuste a `DATABASE_URL` em `backend/.env`.

## 2. Back-end (porta 3001)

```bash
cd backend
npm install
npm run prisma:generate   # gera o Prisma Client
npm run prisma:migrate    # cria/atualiza as tabelas (inclui a migration da moderação)
npm run seed              # cria admin, aluno e dados de exemplo
npm run dev               # ou: npm start
```

- API: http://localhost:3001
- Swagger (documentação): http://localhost:3001/api-docs
- O arquivo `backend/.env` já vem pronto (veja `.env.example`).

Usuários criados pelo seed:

| Perfil | E-mail                | Senha         |
|--------|-----------------------|---------------|
| Admin  | admin@cyberlearn.com  | Admin@123456  |
| Aluno  | aluno@cyberlearn.com  | Aluno@123456  |

## 3. Front-end (porta 3000)

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:3000. O endereço da API fica em
`frontend/.env.local` (`NEXT_PUBLIC_API_URL`).

## Onde está a integração no front

- `frontend/lib/api.ts`: todas as chamadas ao back-end (login, módulos, materiais, tópicos).
- `frontend/lib/auth.ts`: guarda o token JWT e o usuário logado.
- `frontend/lib/useApi.ts`: hook que carrega dados e controla loading/erro.
- Páginas ligadas à API: login, cadastro, ensino (módulos), materiais e discussão.

## Moderação de conteúdo (tópicos e respostas)

Tudo que os usuários publicam passa por 3 camadas antes de aparecer para os outros:

1. **Regras locais** (`backend/src/services/moderationRules.js`): gratuitas e instantâneas.
   Bloqueiam spam e chaves privadas vazadas, e marcam como suspeitos comandos destrutivos
   (`rm -rf /`), `curl ... | bash`, "desative o antivírus/firewall", pedidos de senha,
   links encurtados ou executáveis, dados pessoais e tentativas de enganar a IA.
2. **IA do Google Gemini (plano gratuito)** (`aiModerationService.js`): lê o texto com um prompt
   feito para uma plataforma de ensino de segurança. Permite discussão educativa sobre ataques e
   defesa, mas barra conselhos que deixam as pessoas inseguras, ajuda para atacar terceiros,
   links maliciosos, assédio e spam.
3. **Fila de revisão** (`/admin/moderacao`): se algo for suspeito, ou se a IA estiver fora do ar,
   o conteúdo fica **em análise** (só o autor e os admins veem) até um administrador aprovar ou rejeitar.

| Resultado | O que acontece |
|-----------|----------------|
| Seguro | Publicado na hora. |
| Suspeito / IA indisponível | Salvo como "em análise" e enviado à fila do admin. |
| Violação clara | Recusado (erro 422 com o motivo). Fica registrado na aba "Bloqueados" do admin. |

### Ativando a IA (opcional, grátis)

1. Crie uma chave em https://aistudio.google.com/apikey
2. Em `backend/.env`, preencha `GEMINI_API_KEY=sua_chave`
3. Reinicie o back-end. Ele mostra "Moderação de conteúdo: regras locais + IA (Gemini)".

Sem a chave, o sistema funciona só com as regras locais.

Observações importantes:
- No plano gratuito, o Google pode usar os textos enviados para melhorar seus produtos.
  Por isso o sistema troca e-mails, CPF, telefones e cartões por marcadores antes de enviar.
  Para dados sensíveis de verdade, use uma chave de plano pago.
- As cotas do plano gratuito mudam com o tempo. Se a cota acabar, nada se perde:
  o conteúdo vai para a fila de revisão. Se o modelo for aposentado, troque `GEMINI_MODEL` no `.env`.
- Cada usuário pode publicar no máximo 6 vezes por minuto (`POST_RATE_LIMIT_PER_MIN`).

### Onde ajustar

- Palavras/padrões suspeitos: lista `RULES` em `moderationRules.js`.
- O que a IA deve ou não aceitar: `SYSTEM_PROMPT` em `aiModerationService.js`.

