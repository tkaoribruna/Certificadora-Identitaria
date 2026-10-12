import Link from "next/link";

type ButtonProps = {
  texto: string;
  variante?: "primario" | "secundario";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
};

export function Button({
  texto,
  variante = "primario",
  onClick,
  type = "button",
  href,
}: ButtonProps) {
  const estilos =
    variante === "primario"
      ? "bg-[#00E5FF] text-[#0A0F1D] hover:bg-[#00cce6]"
      : "border border-[#6366F1] text-white hover:bg-[#6366F1]";

  const classes = `rounded-lg px-5 py-3 font-semibold transition-colors ${estilos}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {texto}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {texto}
    </button>
  );
}