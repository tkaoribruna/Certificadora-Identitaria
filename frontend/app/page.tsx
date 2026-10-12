import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero: apresentação principal */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Badge variante="primario">Security Academy & Hub</Badge>

            <h1 className="mt-8 font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Aprenda Cyber Segurança
              <span className="block text-[#00E5FF]">
                de forma colaborativa.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Aprimore seus conhecimentos, compartilhe experiências e explore o
              universo da cibersegurança em uma comunidade feita para aprender
              em conjunto.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button texto="Começar a aprender" href="/ensino" />

              <Button
                texto="Explorar discussões"
                variante="secundario"
                href="/discussao"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Apresentação dos recursos */}
      <section className="pb-24">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
              Conhecimento que cresce em comunidade
            </h2>

            <p className="mt-3 text-gray-400">
              Explore diferentes formas de aprender e compartilhar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card titulo="Aprenda">
              <Badge variante="primario">Ensino</Badge>

              <p className="mt-4 leading-7 text-gray-400">
                Explore conteúdos educacionais e desenvolva suas habilidades em
                cibersegurança.
              </p>
            </Card>

            <Card titulo="Compartilhe">
              <Badge variante="sucesso">Comunidade</Badge>

              <p className="mt-4 leading-7 text-gray-400">
                Participe de discussões, troque experiências e aprenda com
                outros estudantes.
              </p>
            </Card>

            <Card titulo="Descubra">
              <Badge variante="aviso">Materiais</Badge>

              <p className="mt-4 leading-7 text-gray-400">
                Encontre materiais de apoio para aprofundar seus conhecimentos e
                continuar evoluindo.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </main>
  );
}
