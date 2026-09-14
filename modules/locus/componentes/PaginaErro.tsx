import type { ReactNode } from "react";
import { Typography } from "antd";
import IlustracaoPadrao from "@locus/assets/sad-locus.svg?react";
import { CardVazio, CardVazioImagem, CardVazioTitulo } from "@locus/estilos";

const { Text } = Typography;

const LARGURA_ILUSTRACAO = 181;
const ALTURA_ILUSTRACAO = 207;

export interface PaginaErroProps {
  titulo: string;
  descricao?: ReactNode;
  acao?: ReactNode;
  ilustracao?: ReactNode;
}

export function PaginaErro({
  titulo,
  descricao,
  acao,
  ilustracao,
}: PaginaErroProps) {
  return (
    <CardVazio style={{ marginTop: "100px" }}>
      <CardVazioImagem>
        {ilustracao ?? (
          <IlustracaoPadrao
            width={LARGURA_ILUSTRACAO}
            height={ALTURA_ILUSTRACAO}
            role="presentation"
          />
        )}
      </CardVazioImagem>
      <CardVazioTitulo>{titulo}</CardVazioTitulo>
      {descricao ? <Text type="secondary">{descricao}</Text> : null}
      {acao ?? null}
    </CardVazio>
  );
}

export default PaginaErro;