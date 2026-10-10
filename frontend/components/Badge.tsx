type BadgeProps = {
  children: React.ReactNode;
  variante?: "primario" | "sucesso" | "aviso";
};

export function Badge({
  children,
  variante = "primario",
}: BadgeProps) {
  const estilos = {
    primario: "bg-[#6366F1]/20 text-[#A5B4FC]",
    sucesso: "bg-[#10B981]/20 text-[#10B981]",
    aviso: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${estilos[variante]}`}
    >
      {children}
    </span>
  );
}