"use client";

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

const tipos = {
  VIDEO: { nome: "Vídeo", formato: "Assistir" },
  SLIDE: { nome: "Slides", formato: "Apresentação" },
  DOCUMENT: { nome: "Documento", formato: "Leitura" },
} as const;

export default function MateriaisPage() {
  const { logado, pronto } = useAuth();

  const { dados, erro, carregando } = useApi(
    () => Promise.all([api.listarMateriais(), api.listarModulos()]),
    logado,
  );

  const materiais = dados?.[0] ?? [];
  const modulos = dados?.[1] ?? [];

  function nomeDoModulo(moduloId: number) {
    return modulos.find((m) => m.id === moduloId)?.title ?? "Módulo";
  }

  return (
    <main className="flex-1 py-16 sm:py-20">
      <Container>
        <section className="mb-12">
          <Badge variante="primario">Biblioteca CyberLearn</Badge>

          <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-5xl">
            Conhecimento para{" "}
            <span className="text-[#00E5FF]">continuar evoluindo.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Explore guias, resumos e recursos de apoio para aprofundar seus
            conhecimentos em cibersegurança.
          </p>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-semibold text-white">
              Materiais disponíveis
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Encontre recursos para diferentes temas e objetivos de estudo.
            </p>
          </div>

          {!pronto ? (
            <Loading />
          ) : !logado ? (
            <RequerLogin />
          ) : carregando ? (
            <Loading mensagem="Carregando materiais..." />
          ) : erro ? (
            <Alert mensagem={erro} variante="erro" />
          ) : materiais.length === 0 ? (
            <Alert
              mensagem="Nenhum material cadastrado ainda."
              variante="info"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {materiais.map((material) => {
                const tipo = tipos[material.type];

                return (
                  <Card key={material.id} titulo={material.title}>
                    <div className="flex flex-wrap gap-2">
                      <Badge variante="primario">
                        {nomeDoModulo(material.moduleId)}
                      </Badge>
                      <Badge variante="neutro">{tipo.nome}</Badge>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm text-gray-500">
                        {tipo.formato}
                      </span>

                      <Button
                        texto="Acessar material"
                        variante="secundario"
                        onClick={() =>
                          window.open(material.url, "_blank", "noopener")
                        }
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-16 rounded-2xl border border-[#00E5FF]/20 bg-[#00E5FF]/5 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-white sm:text-2xl">
            Aprenda e compartilhe
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Além de consultar materiais, participe das discussões e troque
            conhecimentos com a comunidade.
          </p>

          <div className="mt-6">
            <Button texto="Explorar discussões" href="/discussao" />
          </div>
        </section>
      </Container>
    </main>
  );
}