import type { ReactNode } from "react";
import { Typography } from "antd";
import { SecaoAcao, SecaoCabecalho, SecaoTextos } from "@locus/estilos";

const { Title, Paragraph } = Typography;

export interface CabecalhoSecaoProps {
  titulo: string;
  descricao?: ReactNode;
  acao?: ReactNode;
  larguraAcao?: number;
}

export function CabecalhoSecao({
  titulo,
  descricao,
  acao,
  larguraAcao,
}: CabecalhoSecaoProps) {
  return (
    <SecaoCabecalho>
      <SecaoTextos>
        <Title level={4} style={{ marginTop: 0 }}>
          {titulo}
        </Title>
        {descricao ? (
          <Paragraph style={{ marginBottom: 0 }}>{descricao}</Paragraph>
        ) : null}
      </SecaoTextos>
      {acao ? <SecaoAcao $largura={larguraAcao}>{acao}</SecaoAcao> : null}
    </SecaoCabecalho>
  );
}

export default CabecalhoSecao;
