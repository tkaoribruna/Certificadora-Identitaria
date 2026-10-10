"use client";

import type { ReactNode } from "react";

type ModalProps = {
  titulo: string;
  children: ReactNode;
  aberto: boolean;
  onFechar: () => void;
};

export function Modal({
  titulo,
  children,
  aberto,
  onFechar,
}: ModalProps) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onFechar();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-full max-w-lg rounded-xl border border-gray-800 bg-[#0A0F1D] p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="modal-titulo"
            className="font-heading text-xl font-semibold text-white"
          >
            {titulo}
          </h2>

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar modal"
            className="text-2xl text-gray-400 transition-colors hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="text-gray-300">{children}</div>
      </section>
    </div>
  );
}