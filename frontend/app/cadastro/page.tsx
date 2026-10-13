"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro("Informe um endereço de e-mail válido.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    // O cadastro real será implementado na integração com a API.
    setTimeout(() => {
      setCarregando(false);
      setErro(
        "O cadastro ainda não está disponível. A integração com o servidor será implementada posteriormente.",
      );
    }, 500);
  }

  return (
    <main className="flex flex-1 items-center py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <Badge variante="primario">Comece sua jornada</Badge>

            <h1 className="mt-5 font-heading text-3xl font-bold text-white sm:text-4xl">
              Crie sua conta na{" "}
              <span className="text-[#00E5FF]">CyberLearn.</span>
            </h1>

            <p className="mt-4 leading-7 text-gray-400">
              Cadastre-se para explorar conteúdos e desenvolver suas
              habilidades em cibersegurança.
            </p>
          </div>

          <Card titulo="Criar conta">
            <form onSubmit={handleSubmit} className="space-y-5">
              {erro && <Alert mensagem={erro} variante="erro" />}

              <Input
                label="Nome completo"
                type="text"
                name="nome"
                placeholder="Digite seu nome"
                autoComplete="name"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />

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
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />

              <Input
                label="Confirmar senha"
                type="password"
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                required
              />

              <div className="pt-2">
                <Button
                  texto={carregando ? "Aguarde..." : "Criar conta"}
                  type="submit"
                />
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-[#00E5FF] hover:underline"
              >
                Entrar
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </main>
  );
}
