import Link from "next/link";
import { Container } from "./Container";

const links = [
  { href: "/", texto: "Início" },
  { href: "/ensino", texto: "Ensino" },
  { href: "/discussao", texto: "Discussão" },
  { href: "/materiais", texto: "Materiais" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0A0F1D]">
      <Container>
        <div className="flex flex-col gap-8 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-bold text-white transition-colors hover:text-[#00E5FF]"
            >
              CyberLearn
            </Link>

            <p className="mt-2 text-sm text-gray-400">
              Security Academy & Hub
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-[#00E5FF]"
              >
                {link.texto}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CyberLearn
          </p>
        </div>
      </Container>
    </footer>
  );
}