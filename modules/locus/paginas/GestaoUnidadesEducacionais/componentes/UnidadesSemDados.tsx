import type { ReactNode } from "react";
import { Typography } from "antd";
import IlustracaoPadrao from "@locus/assets/sad-locus.svg?react";
import { CardVazio, CardVazioImagem, CardVazioTitulo } from "@locus/estilos";

const { Text } = Typography;

const LARGURA_ILUSTRACAO = 181;
const ALTURA_ILUSTRACAO = 207;

export interface UnidadesSemDadosProps {
  titulo: string;
  descricao?: ReactNode;
  acao?: ReactNode;
  ilustracao?: ReactNode;
}

export function UnidadesSemDados({
  titulo,
  descricao,
  acao,
  ilustracao,
}: UnidadesSemDadosProps) {
  return (
    <CardVazio>
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
      {acao ? acao : null}
    </CardVazio>
  );
}

export default UnidadesSemDados;
