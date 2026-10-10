type AlertProps = {
  mensagem: string;
  variante?: "sucesso" | "erro" | "aviso" | "info";
};

export function Alert({
  mensagem,
  variante = "info",
}: AlertProps) {
  const estilos = {
    sucesso: "border-[#10B981] bg-[#10B981]/10 text-[#10B981]",
    erro: "border-red-500 bg-red-500/10 text-red-400",
    aviso: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    info: "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]",
  };

  return (
    <div
      role={variante === "erro" ? "alert" : "status"}
      className={`rounded-lg border p-4 text-sm ${estilos[variante]}`}
    >
      {mensagem}
    </div>
  );
}