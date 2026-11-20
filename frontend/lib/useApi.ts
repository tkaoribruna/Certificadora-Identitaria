"use client";

import { useCallback, useEffect, useState } from "react";

type Estado<T> = {
  dados: T | null;
  erro: string;
  // Chave da última busca concluída (para saber se os dados são da aba atual)
  chave: string;
};

// Executa uma chamada à API quando a página abre e controla
// os estados de carregamento e erro.
//   ativo  -> só busca quando for true (ex.: usuário logado)
//   chave  -> mude para refazer a busca (ex.: troca de aba)
export function useApi<T>(
  carregar: () => Promise<T>,
  ativo = true,
  chave: string | number = "",
) {
  const [estado, setEstado] = useState<Estado<T>>({
    dados: null,
    erro: "",
    chave: "",
  });
  const [versao, setVersao] = useState(0);

  const chaveAtual = String(chave);

  useEffect(() => {
    if (!ativo) return;

    let cancelado = false;

    carregar()
      .then((dados) => {
        if (!cancelado) setEstado({ dados, erro: "", chave: chaveAtual });
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setEstado({
          dados: null,
          erro: e instanceof Error ? e.message : "Erro inesperado.",
          chave: chaveAtual,
        });
      });

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo, chaveAtual, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return {
    dados: estado.dados,
    erro: estado.erro,
    // Só mostra "carregando" na primeira busca ou ao trocar a chave;
    // num recarregamento os dados anteriores continuam na tela.
    carregando: ativo && estado.chave !== chaveAtual,
    recarregar,
  };
}
