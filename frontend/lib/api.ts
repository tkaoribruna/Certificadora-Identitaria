import { getToken, limparSessao, type Usuario } from "./auth";

// Cliente da API do back-end. A documentação das rotas está em
// http://localhost:3001/api-docs (Swagger).

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ---------- Tipos (espelham o schema.prisma) ----------

export type Modulo = {
  id: number;
  title: string;
  description: string;
  userId: number;
};

export type TipoMaterial = "VIDEO" | "SLIDE" | "DOCUMENT";

export type Material = {
  id: number;
  title: string;
  url: string;
  type: TipoMaterial;
  moduleId: number;
};

// APPROVED = publicado | PENDING = aguardando revisão | REJECTED = bloqueado
export type StatusModeracao = "APPROVED" | "PENDING" | "REJECTED";

export type Topico = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
  moderationStatus: StatusModeracao;
  moderationReason?: string | null;
  user?: { id: number; name: string };
  _count?: { comments: number };
};

export type Comentario = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  learningMaterialId: number | null;
  discussionTopicId: number | null;
  moderationStatus: StatusModeracao;
  moderationReason?: string | null;
  user?: { id: number; name: string };
};

export type ComentarioModeracao = Comentario & {
  discussionTopic?: { id: number; title: string } | null;
  learningMaterial?: { id: number; title: string } | null;
};

export type FilaModeracao = {
  topics: Topico[];
  comments: ComentarioModeracao[];
};

// ---------- Requisições ----------

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  caminho: string,
  opcoes: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = opcoes;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se o back-end está rodando.",
      0,
    );
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Token expirado/inválido: encerra a sessão local.
    if (resposta.status === 401 && auth) limparSessao();

    const mensagem =
      (dados && (dados.error || dados.message)) ||
      `Erro ${resposta.status} ao acessar o servidor.`;
    throw new ApiError(mensagem, resposta.status);
  }

  return dados as T;
}

// ---------- Rotas ----------

export const api = {
  // Usuários
  cadastrar: (name: string, email: string, password: string) =>
    request<Usuario>("/api/users", {
      method: "POST",
      body: { name, email, password },
      auth: false,
    }),

  login: (email: string, password: string) =>
    request<{ user: Usuario; token: string }>("/api/users/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  // Módulos e materiais
  listarModulos: () => request<Modulo[]>("/api/modules"),
  listarMateriais: () => request<Material[]>("/api/materials"),

  // Discussões
  listarTopicos: () => request<Topico[]>("/api/topics"),
  criarTopico: (title: string, description: string) =>
    request<Topico>("/api/topics", {
      method: "POST",
      body: { title, description },
    }),
  buscarTopico: (id: number) => request<Topico>(`/api/topics/${id}`),
  listarComentariosDoTopico: (id: number) =>
    request<Comentario[]>(`/api/topics/${id}/comments`),
  criarComentario: (content: string, discussionTopicId: number) =>
    request<Comentario>("/api/comments", {
      method: "POST",
      body: { content, discussionTopicId },
    }),

  // Moderação (somente administradores)
  filaModeracao: (status: "PENDING" | "REJECTED") =>
    request<FilaModeracao>(`/api/moderation/queue?status=${status}`),
  moderarTopico: (
    id: number,
    decision: "APPROVED" | "REJECTED",
    reason?: string,
  ) =>
    request<Topico>(`/api/moderation/topics/${id}`, {
      method: "PATCH",
      body: { decision, reason },
    }),
  moderarComentario: (
    id: number,
    decision: "APPROVED" | "REJECTED",
    reason?: string,
  ) =>
    request<Comentario>(`/api/moderation/comments/${id}`, {
      method: "PATCH",
      body: { decision, reason },
    }),
};
