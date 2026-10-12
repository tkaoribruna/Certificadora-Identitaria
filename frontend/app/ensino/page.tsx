"use client";

import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const cursos = [
  {
    titulo: "Fundamentos de Cibersegurança",
    descricao:
      "Aprenda os conceitos fundamentais de segurança da informação, ameaças digitais e proteção de sistemas.",
    categoria: "Fundamentos",
    nivel: "Iniciante",
    duracao: "4 módulos",
  },
  {
    titulo: "Segurança de Redes",
    descricao:
      "Conheça os principais conceitos de redes, protocolos e mecanismos utilizados para proteger conexões.",
    categoria: "Redes",
    nivel: "Intermediário",
    duracao: "6 módulos",
  },
  {
    titulo: "Desenvolvimento Web Seguro",
    descricao:
      "Explore vulnerabilidades comuns em aplicações web e boas práticas para desenvolver sistemas mais seguros.",
    categoria: "Desenvolvimento",
    nivel: "Intermediário",
    duracao: "5 módulos",
  },
  {
    titulo: "Criptografia Essencial",
    descricao:
      "Entenda como a criptografia contribui para a confidencialidade, integridade e proteção dos dados.",
    categoria: "Criptografia",
    nivel: "Intermediário",
    duracao: "4 módulos",
  },
  {
    titulo: "Engenharia Social",
    descricao:
      "Aprenda a reconhecer tentativas de manipulação, phishing e outras técnicas de engenharia social.",
    categoria: "Ameaças",
    nivel: "Iniciante",
    duracao: "3 módulos",
  },
  {
    titulo: "Introdução ao Pentest",
    descricao:
      "Conheça as etapas de uma avaliação de segurança realizada em ambientes autorizados.",
    categoria: "Segurança ofensiva",
    nivel: "Avançado",
    duracao: "7 módulos",
  },
];

export default function EnsinoPage() {
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
                Conteúdos disponíveis
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Explore os temas e escolha por onde começar.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {cursos.length} conteúdos demonstrativos
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cursos.map((curso) => (
              <Card key={curso.titulo} titulo={curso.titulo}>
                <div className="flex flex-wrap gap-2">
                  <Badge variante="primario">{curso.categoria}</Badge>
                  <Badge variante="neutro">{curso.nivel}</Badge>
                </div>

                <p className="mt-4 min-h-20 leading-7 text-gray-400">
                  {curso.descricao}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-gray-500">
                    {curso.duracao}
                  </span>

                  <Button
                    texto="Explorar"
                    variante="secundario"
                    onClick={() =>
                      alert(
                        "Este conteúdo é demonstrativo. O acesso será implementado nas próximas etapas."
                      )
                    }
                  />
                </div>
              </Card>
            ))}
          </div>
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