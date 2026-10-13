"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro("Informe um endereço de e-mail válido.");
      return;
    }

    setCarregando(true);

    // Autenticação real será implementada na integração com a API.
    setTimeout(() => {
      setCarregando(false);
      setErro(
        "A autenticação ainda não está disponível. A integração com o servidor será implementada posteriormente.",
      );
    }, 500);
  }

  return (
    <main className="flex flex-1 items-center py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <Badge variante="primario">Bem-vindo de volta</Badge>

            <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
              Entre na <span className="text-[#00E5FF]">CyberLearn.</span>
            </h1>

            <p className="mt-4 leading-7 text-gray-400">
              Acesse sua conta e continue sua jornada em cibersegurança.
            </p>
          </div>

          <Card titulo="Entrar na sua conta">
            <form onSubmit={handleSubmit} className="space-y-5">
              {erro && <Alert mensagem={erro} variante="erro" />}

              <Input
                label="E-mail"
                type="email"
                name="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <Input
                label="Senha"
                type="password"
                name="senha"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />

              <div className="pt-2">
                <Button
                  texto={carregando ? "Aguarde..." : "Entrar"}
                  type="submit"
                />
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Ainda não possui uma conta?{" "}
              <Link
                href="/cadastro"
                className="font-medium text-[#00E5FF] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </main>
  );
}
