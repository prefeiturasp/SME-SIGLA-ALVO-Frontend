import type { ReactNode } from "react";
import {
  PaginaAcoes,
  PaginaCabecalho,
  PaginaSubtitulo,
  PaginaTextos,
  PaginaTitulo,
} from "@locus/estilos";

export interface CabecalhoPaginaProps {
  titulo: string;
  subtitulo?: ReactNode;
  acoes?: ReactNode;
}

export function CabecalhoPagina({
  titulo,
  subtitulo,
  acoes,
}: CabecalhoPaginaProps) {
  return (
    <PaginaCabecalho>
      <PaginaTextos>
        <PaginaTitulo>{titulo}</PaginaTitulo>
        {subtitulo ? <PaginaSubtitulo>{subtitulo}</PaginaSubtitulo> : null}
      </PaginaTextos>
      {acoes ? <PaginaAcoes>{acoes}</PaginaAcoes> : null}
    </PaginaCabecalho>
  );
}

export default CabecalhoPagina;
