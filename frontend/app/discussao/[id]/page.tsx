"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
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

const LIMITE = 2000;

export default function TopicoPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const idValido = Number.isInteger(id) && id > 0;

  const { logado, pronto } = useAuth();

  const { dados, erro, carregando, recarregar } = useApi(
    () =>
      Promise.all([api.buscarTopico(id), api.listarComentariosDoTopico(id)]),
    logado && idValido,
  );

  const topico = dados?.[0];
  const comentarios = dados?.[1] ?? [];

  const [texto, setTexto] = useState("");
  const [erroForm, setErroForm] = useState("");
  const [aviso, setAviso] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleResponder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroForm("");
    setAviso("");
    setSucesso("");

    if (!texto.trim()) {
      setErroForm("Escreva sua resposta antes de enviar.");
      return;
    }

    setEnviando(true);

    try {
      const criado = await api.criarComentario(texto.trim(), id);
      setTexto("");

      if (criado.moderationStatus === "PENDING") {
        setAviso(
          "Sua resposta foi enviada para análise e ficará visível para os outros usuários depois de aprovada.",
        );
      } else {
        setSucesso("Resposta publicada.");
      }

      recarregar();
    } catch (e) {
      setErroForm(e instanceof Error ? e.message : "Erro ao enviar a resposta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex-1 py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <Button texto="← Voltar às discussões" href="/discussao" variante="secundario" />
        </div>

        {!pronto ? (
          <Loading />
        ) : !logado ? (
          <RequerLogin />
        ) : !idValido ? (
          <Alert mensagem="Discussão inválida." variante="erro" />
        ) : carregando ? (
          <Loading mensagem="Carregando discussão..." />
        ) : erro || !topico ? (
          <Alert mensagem={erro || "Discussão não encontrada."} variante="erro" />
        ) : (
          <>
            <section className="mb-10">
              <Badge variante="primario">Discussão</Badge>

              <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
                {topico.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                <span>Por {topico.user?.name ?? "Usuário"}</span>
                <span>{tempoDecorrido(topico.createdAt)}</span>
              </div>

              {topico.moderationStatus === "PENDING" && (
                <div className="mt-4">
                  <Alert
                    variante="aviso"
                    mensagem="Esta discussão está em análise e só você e os administradores conseguem vê-la."
                  />
                </div>
              )}

              <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-300">
                {topico.description}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-white">
                {comentarios.length}{" "}
                {comentarios.length === 1 ? "resposta" : "respostas"}
              </h2>

              <div className="mt-6 grid gap-4">
                {comentarios.length === 0 && (
                  <Alert
                    mensagem="Ainda não há respostas. Seja o primeiro a responder!"
                    variante="info"
                  />
                )}

                {comentarios.map((comentario) => (
                  <Card key={comentario.id} titulo={comentario.user?.name ?? "Usuário"}>
                    {comentario.moderationStatus === "PENDING" && (
                      <div className="mb-3">
                        <Badge variante="aviso">
                          Em análise — só você e os administradores veem
                        </Badge>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap leading-7 text-gray-300">
                      {comentario.content}
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                      {tempoDecorrido(comentario.createdAt)}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-white">
                Sua resposta
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Para manter a comunidade segura, as respostas passam por uma
                verificação automática antes de aparecerem para todos.
              </p>

              <form onSubmit={handleResponder} className="mt-5 space-y-4">
                {erroForm && <Alert mensagem={erroForm} variante="erro" />}
                {aviso && <Alert mensagem={aviso} variante="info" />}
                {sucesso && <Alert mensagem={sucesso} variante="sucesso" />}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="resposta"
                    className="text-sm font-medium text-white"
                  >
                    Escreva sua resposta
                  </label>
                  <textarea
                    id="resposta"
                    rows={5}
                    maxLength={LIMITE}
                    placeholder="Compartilhe o que você sabe..."
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                    className="rounded-lg border border-gray-700 bg-[#0A0F1D] px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#00E5FF]"
                  />
                  <span className="self-end text-xs text-gray-500">
                    {texto.length}/{LIMITE}
                  </span>
                </div>

                <Button
                  texto={enviando ? "Verificando e enviando..." : "Responder"}
                  type="submit"
                  disabled={enviando}
                />
              </form>
            </section>
          </>
        )}
      </Container>
    </main>
  );
}
