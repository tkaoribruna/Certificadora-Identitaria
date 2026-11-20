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

export default function EnsinoPage() {
  const { logado, pronto } = useAuth();

  const { dados: modulos, erro, carregando } = useApi(
    () => Promise.all([api.listarModulos(), api.listarMateriais()]),
    logado,
  );

  const lista = modulos?.[0] ?? [];
  const materiais = modulos?.[1] ?? [];

  function contarMateriais(moduloId: number) {
    return materiais.filter((m) => m.moduleId === moduloId).length;
  }

  return (
    <main className="flex-1 py-16 sm:py-20">
      <Container>
        <section className="mb-12">
          <Badge variante="primario">Área de aprendizagem</Badge>

          <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-5xl">
            Explore o universo da{" "}
            <span className="text-[#00E5FF]">cibersegurança.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Desenvolva suas habilidades, aprenda novos conceitos e avance
            nos seus estudos com conteúdos organizados por temas e níveis.
          </p>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-white">
                Módulos disponíveis
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Explore os temas e escolha por onde começar.
              </p>
            </div>

            {logado && !carregando && !erro && (
              <span className="text-sm text-gray-500">
                {lista.length} {lista.length === 1 ? "módulo" : "módulos"}
              </span>
            )}
          </div>

          {!pronto ? (
            <Loading />
          ) : !logado ? (
            <RequerLogin />
          ) : carregando ? (
            <Loading mensagem="Carregando módulos..." />
          ) : erro ? (
            <Alert mensagem={erro} variante="erro" />
          ) : lista.length === 0 ? (
            <Alert mensagem="Nenhum módulo cadastrado ainda." variante="info" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lista.map((modulo) => {
                const total = contarMateriais(modulo.id);

                return (
                  <Card key={modulo.id} titulo={modulo.title}>
                    <p className="min-h-20 leading-7 text-gray-400">
                      {modulo.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm text-gray-500">
                        {total} {total === 1 ? "material" : "materiais"}
                      </span>

                      <Button
                        texto="Ver materiais"
                        variante="secundario"
                        href="/materiais"
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
            Aprender também é compartilhar.
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Amplie seus conhecimentos participando de discussões e trocando
            experiências com a comunidade CyberLearn.
          </p>

          <div className="mt-6">
            <Button texto="Ir para discussões" href="/discussao" />
          </div>
        </section>
      </Container>
    </main>
  );
}