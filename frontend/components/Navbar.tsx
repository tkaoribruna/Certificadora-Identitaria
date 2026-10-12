"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

const links = [
  { href: "/", texto: "Início" },
  { href: "/ensino", texto: "Ensino" },
  { href: "/discussao", texto: "Discussão" },
  { href: "/materiais", texto: "Materiais" },
  { href: "/login", texto: "Login" },
];

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0F1D]/90 backdrop-blur-md">
      <nav aria-label="Navegação principal">
        <Container>
          {/* Logo, links desktop e botão mobile */}
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              aria-label="CyberLearn - Página inicial"
              className="shrink-0"
              onClick={() => setMenuAberto(false)}
            >
              <Image
                src="/logo.png"
                alt="CyberLearn"
                width={120}
                height={80}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Navegação desktop */}
            <div className="hidden items-center gap-6 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 transition-colors hover:text-[#00E5FF]"
                >
                  {link.texto}
                </Link>
              ))}
            </div>

            {/* Botão do menu mobile */}
            <button
              type="button"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:border-[#00E5FF] md:hidden"
            >
              <span aria-hidden="true" className="text-xl">
                {menuAberto ? "✕" : "☰"}
              </span>
            </button>
          </div>

          {/* Navegação mobile */}
          {menuAberto && (
            <div
              id="menu-mobile"
              className="flex flex-col gap-4 border-t border-white/10 py-5 md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className="rounded-md py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-[#00E5FF]"
                >
                  {link.texto}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}