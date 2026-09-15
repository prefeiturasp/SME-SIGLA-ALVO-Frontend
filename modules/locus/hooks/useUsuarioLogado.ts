import { useMemo } from "react";
import {
  obterUsuarioLogado,
  type UsuarioLogado,
} from "@locus/servicos/recursos/autenticacao";

export function useUsuarioLogado(): UsuarioLogado {
  return useMemo(() => obterUsuarioLogado(), []);
}

export default useUsuarioLogado;
