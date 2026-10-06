import Image from "next/image";
import { Container } from "./Container";

export function Navbar() {
  return (
    <nav>
    <Container>
        <div className="flex items-center justify-between">
          <Image src="/logo.png" alt="Logo" width={120} height={40} priority />
          <div className="flex gap-6 p-3">
            <a href="./" className="text-white hover:text-[#00E5FF]">
              Inicio
            </a>
            <a href="/ensino" className="text-white hover:text-[#00E5FF]">
              Ensino
            </a>
            <a href="/discussao" className="text-white hover:text-[#00E5FF]">
              Discussão
            </a>
            <a href="/materiais" className="text-white hover:text-[#00E5FF]">
              Materiais
            </a>
            <a href="/login" className="text-white hover:text-[#00E5FF]">
              Login
            </a>
          </div>
        </div>
    </Container>
    </nav>
  );
}
