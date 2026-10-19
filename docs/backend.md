# Documentação do Backend - CyberAcademy

## Visão Geral

O backend do CyberAcademy é responsável por fornecer os serviços e regras de negócio necessários para o funcionamento da plataforma, realizando a comunicação entre o frontend e os dados da aplicação.

Atualmente, o backend possui sua estrutura inicial configurada, incluindo servidor, organização de rotas e a configuração inicial da persistência de dados.

## Tecnologias Utilizadas

- **Node.js:** ambiente de execução utilizado para desenvolver o backend em JavaScript.
- **Express:** framework utilizado para criação do servidor e organização das rotas da API.
- **Prisma:** ORM (Mapeamento Objeto-Relacional) utilizado para modelar e acessar os dados da aplicação.
-**MySQL:**  banco de dados relacional utilizado atualmente para persistência de dados.

## Estrutura do Backend

A estrutura atual do backend está organizada da seguinte forma:

```text

backend/
├── prisma/
|  ├── migrations/
|  └── schema.prisma
├── src/
|   ├── routes/
|   └── server.js 
├── .gitignore
├── BACKEND.md
├── package.json
├── package-lock.json
└── prisma7.config.ts

```

### Principais Diretórios

- **`prisma/`:** responsável pela definição da estrutura dos dados da aplicação por meio do `schema.prisma`  e pelo armazenamento de migrations, que registram as alterações realizadas na estrutura do banco de dados.
- **`src/`:** concentra o código-fonte do backend. Atualmente contém a configuração do servidor e das rotas  da aplicação e será expandida conforme novas responsabilidades forem implementadas.

### Principais Arquivos

- **`schema.prisma`:** contém a definição dos Models da aplicação, incluindo seus campos, tipos, relacionamentos e enums.
- **`server.js`:** é o ponto de configuração inicial do servidor Express. Nele são configurados os middlewares e registrados os roteadores utilizados pela aplicação.
- **`prisma7.config.ts`:** contém configurações utilizadas pelo Prisma, como a localização do schema e das migrations, além do acesso à variável de ambiente `DATABASE_URL`.

## Banco de Dados e Prisma

O backend utiliza atualmente o MySQL como banco de dados relacional e o Prisma como ORM (Mapeamento de Objeto Relacional).

A estrutura dos dados é definida no arquivo `schema.prisma`, onde são declarados os Models, seus campos, tipos e relacionamentos.

As alterações realizadas na estrutura do banco são versionadas por meio de migrations do Prisma. A migration inicial do projeto foi criada e aplicada ao banco de dados.

### Models 

Atualmente, o schema do banco possui os seguintes Models:

- **`User`:** representa os usuários da plataforma, incluindo estudantes e administradores.
- **`Module`:** representa os Módulos do ambiente de ensino.
- **`LearningMaterial`:** representa os materiais de ensino associados a um módulo, como vídeos, slides, e documentos.
- **`DiscussionTopic`:** representa os tópicos utilizados no ambiente de discussão.
- **`CommunitySubmission`:** representa os materiais enviados pela comunidade para um tópico de discussão e que passam pelo processo de moderação.
- **`Comment`:** representa os comentários realizados pelos usuários em materiais de ensino ou tópicos de discussão.

### Enums

Os enums são utilizados para limitar determinados campos a um conjunto específico de valores permitidos.

- **`UserRole`:** define os perfis de usuário permitidos: `STUDENT` e `ADMIN`.
- **`MaterialType`:** define os tipos de materiais de ensino: `VIDEO`, `SLIDE` e `DOCUMENT`.
- **`SubmissionStatus`:** define os possíveis estados de uma submissão da comunidade: `PENDING`, `APPROVED` e `REJECTED`.

### Relacionamentos

Os principais relacionamentos definidos atualmente entre os Models são:

- **`User -> Module`:** um usuário com perfil `ADMIN` pode gerenciar vários módulos.
- **`Module -> LearningMaterial`:** um módulo pode possuir vários materiais de ensino.
- **`User -> DiscussionTopic`:** um usuário pode criar vários tópicos de discussão.
- **`User -> CommunitySubmission`:** um usuário pode realizar várias submissões.
- **`User -> CommunitySubmission (Moderação)`:** um usuário com perfil `ADMIN` pode moderar várias submissões, enquanto uma submissão pode ainda não possuir um moderador.
- **`DiscussionTopic -> CommunitySubmission`:** um tópico de discussão pode possuir várias submissões.
- **`User -> Comment`:** um usuário pode realizar vários comentários.
- **`LearningMaterial / DiscussionTopic -> Comment`:** um comentário pode estar associado a um material de ensino ou a um tópico de discussão.

## Configuração do Ambiente

As configurações sensíveis e específicas do ambiente são armazenadas em um arquivo `.env`, que não é versionado pelo Git por estar incluído no `.gitignore`.

Atualmente, a variável `DATABASE_URL` é utilizada para configurar a conexão com o banco de dados MySQL.

Exemplo:

```env

DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/cyberacademy" 

```

Cada desenvolvedor deve configurar seu próprio arquivo `.env` localmente com as credenciais correspondentes ao seu ambiente.

## Próximos Passos

O backend ainda está em desenvolvimento. As próximas etapas previstas incluem:

- Definir a estratégia de persistência envolvendo MySQL e MongoDB.
- Configurar o acesso aos dados no código do backend.
- Implementar Controllers e Services conforme as responsabilidades da aplicação.
- Criar os endpoints da API.
- Implementar autenticação e autorização para os perfis `STUDENT` e `ADMIN`.
- Implementar as regras de moderação das submissões da comunidade.
- Documentar os endpoints da API conforme forem implementados.