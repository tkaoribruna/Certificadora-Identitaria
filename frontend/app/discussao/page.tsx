"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { RequerLogin } from "@/components/RequerLogin";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { tempoDecorrido } from "@/lib/format";

export default function DiscussaoPage() {
  const { logado, pronto } = useAuth();

  const {
    dados: topicos,
    erro,
    carregando,
    recarregar,
  } = useApi(() => api.listarTopicos(), logado);

  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroForm, setErroForm] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");

  function abrirModal() {
    setTitulo("");
    setDescricao("");
    setErroForm("");
    setAviso("");
    setModalAberto(true);
  }

  async function handleCriar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroForm("");

    if (!titulo.trim() || !descricao.trim()) {
      setErroForm("Preencha o título e a descrição.");
      return;
    }

    setEnviando(true);

    try {
      const criado = await api.criarTopico(titulo.trim(), descricao.trim());
      setModalAberto(false);

      if (criado.moderationStatus === "PENDING") {
        setAviso(
          "Sua discussão foi enviada para análise e ficará visível para os outros usuários depois de aprovada.",
        );
      }

      recarregar();
    } catch (e) {
      setErroForm(e instanceof Error ? e.message : "Erro ao criar a discussão.");
    } finally {
      setEnviando(false);
    }
  }

  const lista = topicos ?? [];

  return (
    <main className="flex-1 py-16 sm:py-20">
      <Container>
        <section className="mb-12">
          <Badge variante="primario">Comunidade CyberLearn</Badge>

          <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-5xl">
            Compartilhe ideias.{" "}
            <span className="text-[#00E5FF]">Aprenda em conjunto.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Tire dúvidas, compartilhe experiências e participe de conversas
            sobre cibersegurança com outros estudantes.
          </p>

          {logado && (
            <div className="mt-7">
              <Button texto="Criar discussão" onClick={abrirModal} />
            </div>
          )}
        </section>

        <section>
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-semibold text-white">
              Discussões recentes
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Explore perguntas e experiências compartilhadas pela comunidade.
            </p>
          </div>

          {aviso && (
            <div className="mb-6">
              <Alert mensagem={aviso} variante="info" />
            </div>
          )}

          {!pronto ? (
            <Loading />
          ) : !logado ? (
            <RequerLogin />
          ) : carregando ? (
            <Loading mensagem="Carregando discussões..." />
          ) : erro ? (
            <Alert mensagem={erro} variante="erro" />
          ) : lista.length === 0 ? (
            <Alert
              mensagem="Ainda não há discussões. Seja o primeiro a criar uma!"
              variante="info"
            />
          ) : (
            <div className="grid gap-5">
              {lista.map((topico) => {
                const respostas = topico._count?.comments ?? 0;

                return (
                  <Card key={topico.id} titulo={topico.title}>
                    {topico.moderationStatus === "PENDING" && (
                      <div className="mb-3">
                        <Badge variante="aviso">
                          Em análise — só você e os administradores veem
                        </Badge>
                      </div>
                    )}

                    <p className="line-clamp-3 whitespace-pre-wrap leading-7 text-gray-400">
                      {topico.description}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span>Por {topico.user?.name ?? "Usuário"}</span>
                        <span>{tempoDecorrido(topico.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#00E5FF]">
                          {respostas}{" "}
                          {respostas === 1 ? "resposta" : "respostas"}
                        </span>
                        <Button
                          texto="Ver respostas"
                          variante="secundario"
                          href={`/discussao/${topico.id}`}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-white">
            Sua experiência também importa
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Compartilhe dúvidas, explique o que aprendeu e ajude a construir
            uma comunidade colaborativa de segurança da informação.
          </p>
        </section>
      </Container>

      <Modal
        titulo="Criar discussão"
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
      >
        <form onSubmit={handleCriar} className="space-y-5">
          {erroForm && <Alert mensagem={erroForm} variante="erro" />}

          <Input
            label="Título"
            name="titulo"
            placeholder="Sobre o que você quer conversar?"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            required
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="descricao"
              className="text-sm font-medium text-white"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={4}
              placeholder="Explique sua dúvida ou ideia"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-[#0A0F1D] px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#00E5FF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              texto="Cancelar"
              variante="secundario"
              onClick={() => setModalAberto(false)}
            />
            <Button
              texto={enviando ? "Publicando..." : "Publicar"}
              type="submit"
              disabled={enviando}
            />
          </div>
        </form>
      </Modal>
    </main>
  );
}
