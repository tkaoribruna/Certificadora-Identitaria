"use client"

import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const materiais = [
  {
    id: 1,
    titulo: "Guia de Fundamentos de Cibersegurança",
    descricao:
      "Um material introdutório sobre conceitos de segurança da informação, ameaças digitais e medidas de proteção.",
    categoria: "Fundamentos",
    tipo: "Guia",
    formato: "Leitura",
  },
  {
    id: 2,
    titulo: "Introdução à Segurança de Redes",
    descricao:
      "Conheça conceitos de redes, protocolos e práticas que ajudam a proteger a comunicação entre dispositivos.",
    categoria: "Redes",
    tipo: "Apostila",
    formato: "Leitura",
  },
  {
    id: 3,
    titulo: "Checklist de Desenvolvimento Seguro",
    descricao:
      "Uma lista de verificação para apoiar a identificação de riscos e a adoção de boas práticas no desenvolvimento web.",
    categoria: "Desenvolvimento seguro",
    tipo: "Checklist",
    formato: "Referência",
  },
  {
    id: 4,
    titulo: "Conceitos Essenciais de Criptografia",
    descricao:
      "Revise os conceitos de hashing, criptografia simétrica e assimétrica e suas aplicações na proteção de dados.",
    categoria: "Criptografia",
    tipo: "Resumo",
    formato: "Leitura",
  },
  {
    id: 5,
    titulo: "Guia de Identificação de Phishing",
    descricao:
      "Aprenda a reconhecer sinais comuns de mensagens fraudulentas e a avaliar links e solicitações suspeitas.",
    categoria: "Segurança defensiva",
    tipo: "Guia",
    formato: "Referência",
  },
  {
    id: 6,
    titulo: "Laboratório de Segurança em Ambiente Controlado",
    descricao:
      "Uma proposta de estudo prático para explorar conceitos de segurança em um ambiente próprio e autorizado.",
    categoria: "Prática",
    tipo: "Laboratório",
    formato: "Prática",
  },
];

export default function MateriaisPage() {
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

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {materiais.map((material) => (
              <Card key={material.id} titulo={material.titulo}>
                <div className="flex flex-wrap gap-2">
                  <Badge variante="primario">{material.categoria}</Badge>
                  <Badge variante="neutro">{material.tipo}</Badge>
                </div>

                <p className="mt-4 min-h-20 leading-7 text-gray-400">
                  {material.descricao}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-gray-500">
                    {material.formato}
                  </span>

                  <Button
                    texto="Acessar material"
                    variante="secundario"
                    onClick={() =>
                      alert(
                        "O acesso aos materiais será implementado na integração com a API."
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