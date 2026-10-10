import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  erro?: string;
};

export function Input({ label, erro, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-white">
        {label}
      </label>

      <input
        id={inputId}
        {...props}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${inputId}-erro` : undefined}
        className={`rounded-lg border bg-[#0A0F1D] px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#00E5FF] ${
          erro ? "border-red-500" : "border-gray-700"
        }`}
      />

      {erro && (
        <p id={`${inputId}-erro`} className="text-sm text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}