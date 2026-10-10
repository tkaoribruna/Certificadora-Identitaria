type LoadingProps = {
  mensagem?: string;
};

export function Loading({ mensagem = "Carregando..." }: LoadingProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 p-6"
    >
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-[#00E5FF]"
      />

      <p className="text-sm text-gray-400">{mensagem}</p>
    </div>
  );
}