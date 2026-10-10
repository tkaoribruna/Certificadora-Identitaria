type CardProps = {
  titulo?: string;
  children: React.ReactNode;
  className?: string;
};

export function Card({ titulo, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-[#0A0F1D] p-6 ${className}`}
    >
      {titulo && (
        <h2 className="mb-4 font-heading text-xl font-semibold text-white">
          {titulo}
        </h2>
      )}

      {children}
    </div>
  );
}
