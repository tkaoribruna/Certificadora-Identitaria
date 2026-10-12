"use client"

import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const discussoes = [
  {
    id: 1,
    titulo: "Como começar a estudar cibersegurança?",
    descricao:
      "Quais conceitos e ferramentas vocês recomendam para quem está começando na área de segurança da informação?",
    autor: "Ana Silva",
    categoria: "Fundamentos",
    respostas: 12,
    atividade: "Há 15 minutos",
  },
  {
    id: 2,
    titulo: "Boas práticas para proteger uma aplicação web",
    descricao:
      "Vamos compartilhar práticas importantes para reduzir vulnerabilidades durante o desenvolvimento de aplicações web.",
    autor: "Lucas Mendes",
    categoria: "Desenvolvimento seguro",
    respostas: 8,
    atividade: "Há 1 hora",
  },
  {
    id: 3,
    titulo: "Diferenças entre hashing e criptografia",
    descricao:
      "Estou estudando proteção de dados e gostaria de entender melhor quando utilizar hashing e quando utilizar criptografia.",
    autor: "Mariana Costa",
    categoria: "Criptografia",
    respostas: 5,
    atividade: "Há 3 horas",
  },
  {
    id: 4,
    titulo: "Laboratórios para praticar segurança de redes",
    descricao:
      "Quais ambientes de laboratório vocês indicam para aprender análise de tráfego e segurança de redes de forma segura?",
    autor: "Pedro Oliveira",
    categoria: "Redes",
    respostas: 16,
    atividade: "Ontem",
  },
  {
    id: 5,
    titulo: "Como reconhecer tentativas de phishing?",
    descricao:
      "Quais sinais ajudam a identificar mensagens fraudulentas e quais cuidados devemos tomar antes de abrir links?",
    autor: "Julia Ferreira",
    categoria: "Segurança defensiva",
    respostas: 9,
    atividade: "Ontem",
  },
];

const categorias = [
  "Todas",
  "Fundamentos",
  "Desenvolvimento seguro",
  "Criptografia",
  "Redes",
  "Segurança defensiva",
];

export default function DiscussaoPage() {
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

          <div className="mt-7">
            <Button
              texto="Criar discussão"
              onClick={() =>
                alert(
                  "A criação de discussões será implementada junto com a integração da API."
                )
              }
            />
          </div>
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

          <div className="mb-8 flex flex-wrap gap-2">
            {categorias.map((categoria, indice) => (
              <Badge
                key={categoria}
                variante={indice === 0 ? "primario" : "neutro"}
              >
                {categoria}
              </Badge>
            ))}
          </div>

          <div className="grid gap-5">
            {discussoes.map((discussao) => (
              <Card key={discussao.id} titulo={discussao.titulo}>
                <div className="mb-3">
                  <Badge variante="primario">
                    {discussao.categoria}
                  </Badge>
                </div>

                <p className="leading-7 text-gray-400">
                  {discussao.descricao}
                </p>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                    <span>Por {discussao.autor}</span>
                    <span>{discussao.atividade}</span>
                  </div>

                  <span className="text-sm text-[#00E5FF]">
                    {discussao.respostas} respostas
                  </span>
                </div>
              </Card>
            ))}
          </div>
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
    </main>
  );
}