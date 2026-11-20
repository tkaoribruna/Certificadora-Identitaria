"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import { Loading } from "@/components/Loading";
import { RequerLogin } from "@/components/RequerLogin";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { tempoDecorrido } from "@/lib/format";

type Aba = "PENDING" | "REJECTED";

export default function ModeracaoPage() {
  const { usuario, logado, pronto } = useAuth();
  const ehAdmin = usuario?.role === "ADMIN";

  const [aba, setAba] = useState<Aba>("PENDING");
  const [erroAcao, setErroAcao] = useState("");

  const { dados, erro, carregando, recarregar } = useApi(
    () => api.filaModeracao(aba),
    ehAdmin,
    aba,
  );

  const topicos = dados?.topics ?? [];
  const comentarios = dados?.comments ?? [];
  const total = topicos.length + comentarios.length;

  async function decidir(
    tipo: "topico" | "comentario",
    id: number,
    decisao: "APPROVED" | "REJECTED",
  ) {
    setErroAcao("");

    let motivo: string | undefined;

    if (decisao === "REJECTED") {
      const resposta = window.prompt("Motivo da rejeição (opcional):");
      if (resposta === null) return; // cancelou
      motivo = resposta.trim() || undefined;
    }

    try {
      if (tipo === "topico") await api.moderarTopico(id, decisao, motivo);
      else await api.moderarComentario(id, decisao, motivo);

      recarregar();
    } catch (e) {
      setErroAcao(e instanceof Error ? e.message : "Erro ao moderar.");
    }
  }

  return (
    <main className="flex-1 py-16 sm:py-20">
      <Container>
        <section className="mb-10">
          <Badge variante="primario">Administração</Badge>

          <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
            Fila de <span className="text-[#00E5FF]">moderação.</span>
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Conteúdos marcados como suspeitos pela verificação automática
            aguardam sua decisão. Nada aqui é visível para os outros usuários
            até ser aprovado.
          </p>
        </section>

        {!pronto ? (
          <Loading />
        ) : !logado ? (
          <RequerLogin />
        ) : !ehAdmin ? (
          <Alert
            variante="erro"
            mensagem="Acesso restrito a administradores."
          />
        ) : (
          <>
            <div className="mb-8 flex gap-3">
              <Button
                texto="Pendentes"
                variante={aba === "PENDING" ? "primario" : "secundario"}
                onClick={() => setAba("PENDING")}
              />
              <Button
                texto="Bloqueados"
                variante={aba === "REJECTED" ? "primario" : "secundario"}
                onClick={() => setAba("REJECTED")}
              />
            </div>

            {erroAcao && (
              <div className="mb-6">
                <Alert mensagem={erroAcao} variante="erro" />
              </div>
            )}

            {carregando ? (
              <Loading mensagem="Carregando fila..." />
            ) : erro ? (
              <Alert mensagem={erro} variante="erro" />
            ) : total === 0 ? (
              <Alert
                variante="sucesso"
                mensagem={
                  aba === "PENDING"
                    ? "Nenhum conteúdo aguardando revisão."
                    : "Nenhum conteúdo bloqueado."
                }
              />
            ) : (
              <div className="grid gap-5">
                {topicos.map((topico) => (
                  <Card key={`t-${topico.id}`} titulo={topico.title}>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variante="primario">Discussão</Badge>
                      <Badge variante="neutro">
                        {topico.user?.name ?? "Usuário"}
                      </Badge>
                    </div>

                    <p className="whitespace-pre-wrap leading-7 text-gray-300">
                      {topico.description}
                    </p>

                    {topico.moderationReason && (
                      <p className="mt-3 text-sm text-yellow-400">
                        Motivo da marcação: {topico.moderationReason}
                      </p>
                    )}

                    <Acoes
                      data={topico.createdAt}
                      aba={aba}
                      onAprovar={() => decidir("topico", topico.id, "APPROVED")}
                      onRejeitar={() => decidir("topico", topico.id, "REJECTED")}
                    />
                  </Card>
                ))}

                {comentarios.map((comentario) => (
                  <Card
                    key={`c-${comentario.id}`}
                    titulo={comentario.user?.name ?? "Usuário"}
                  >
                    <div className="mb-3 flex flex-wrap gap-2">
                      <Badge variante="primario">Resposta</Badge>
                      {comentario.discussionTopic && (
                        <Link
                          href={`/discussao/${comentario.discussionTopic.id}`}
                          className="text-xs text-[#00E5FF] hover:underline"
                        >
                          em: {comentario.discussionTopic.title}
                        </Link>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap leading-7 text-gray-300">
                      {comentario.content}
                    </p>

                    {comentario.moderationReason && (
                      <p className="mt-3 text-sm text-yellow-400">
                        Motivo da marcação: {comentario.moderationReason}
                      </p>
                    )}

                    <Acoes
                      data={comentario.createdAt}
                      aba={aba}
                      onAprovar={() =>
                        decidir("comentario", comentario.id, "APPROVED")
                      }
                      onRejeitar={() =>
                        decidir("comentario", comentario.id, "REJECTED")
                      }
                    />
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}

function Acoes({
  data,
  aba,
  onAprovar,
  onRejeitar,
}: {
  data: string;
  aba: Aba;
  onAprovar: () => void;
  onRejeitar: () => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">{tempoDecorrido(data)}</span>

      <div className="flex gap-3">
        <Button texto="Aprovar" onClick={onAprovar} />
        {aba === "PENDING" && (
          <Button texto="Rejeitar" variante="secundario" onClick={onRejeitar} />
        )}
      </div>
    </div>
  );
}
