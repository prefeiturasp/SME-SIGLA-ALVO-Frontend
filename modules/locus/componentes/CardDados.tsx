import type { ReactNode } from "react";
import {
  CardDescricao,
  CardDiv,
  CardLinhaTitulo,
  CardTitulo,
  CardTituloIcone,
  CardValor,
} from "@locus/estilos";

export interface CardDadosProps {
  valor: number | string;
  titulo: string;
  descricao: string;
  icone: ReactNode;
}

export function CardDados({
  valor,
  titulo,
  descricao,
  icone,
}: CardDadosProps) {
  return (
    <CardDiv>
      <CardValor>{valor}</CardValor>
      <CardLinhaTitulo>
        <CardTituloIcone aria-hidden>{icone}</CardTituloIcone>
        <CardTitulo>{titulo}</CardTitulo>
      </CardLinhaTitulo>
      <CardDescricao>{descricao}</CardDescricao>
    </CardDiv>
  );
}

export default CardDados;
