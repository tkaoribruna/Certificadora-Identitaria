"use client";

import { useSyncExternalStore } from "react";

// Guarda o token e os dados do usuário no localStorage e avisa os
// componentes quando algo muda (login, logout ou token expirado).

export type Usuario = {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
};

const TOKEN_KEY = "cyberlearn_token";
const USER_KEY = "cyberlearn_user";
const EVENTO = "cyberlearn-auth";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function salvarSessao(token: string, usuario: Usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  window.dispatchEvent(new Event(EVENTO));
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(callback: () => void) {
  window.addEventListener(EVENTO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO, callback);
    window.removeEventListener("storage", callback);
  };
}

// O snapshot precisa ser uma string estável (o JSON do usuário ou "").
function lerUsuarioBruto(): string {
  if (!getToken()) return "";
  return localStorage.getItem(USER_KEY) ?? "";
}

// Retorna o usuário logado (ou null) e se o cliente já "hidratou".
export function useAuth() {
  const bruto = useSyncExternalStore(assinar, lerUsuarioBruto, () => "");
  const pronto = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  let usuario: Usuario | null = null;
  if (bruto) {
    try {
      usuario = JSON.parse(bruto) as Usuario;
    } catch {
      usuario = null;
    }
  }

  return { usuario, logado: Boolean(bruto), pronto };
}
