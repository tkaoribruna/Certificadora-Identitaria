import { Alert } from "./Alert";
import { Button } from "./Button";

// Aviso exibido nas páginas que só funcionam com o usuário logado.
export function RequerLogin() {
  return (
    <div className="space-y-5">
      <Alert
        variante="aviso"
        mensagem="Você precisa estar logado para ver este conteúdo."
      />
      <div className="flex gap-3">
        <Button texto="Entrar" href="/login" />
        <Button texto="Criar conta" href="/cadastro" variante="secundario" />
      </div>
    </div>
  );
}
