import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button, Drawer, Typography } from "antd";
import type { ReactNode } from "react";

const { Paragraph, Text } = Typography;

const LARGURA_PADRAO = "50%";

export interface PainelLateralProps {
  aberto: boolean;
  titulo: string;
  descricao?: ReactNode;
  contexto?: ReactNode;
  largura?: number | string;
  aoFechar: () => void;
  children: ReactNode;
}

export function PainelLateral({
  aberto,
  titulo,
  descricao,
  contexto,
  largura = LARGURA_PADRAO,
  aoFechar,
  children,
}: PainelLateralProps) {
  return (
    <Drawer
      open={aberto}
      title={titulo}
      width={largura}
      placement="right"
      onClose={aoFechar}
      closable={false}
      destroyOnHidden
      extra={
        <Button
          type="default"
          aria-label="Fechar"
          onClick={aoFechar}
          icon={<CloseRoundedIcon fontSize="small" />}
        />
      }
    >
      {descricao ? <Paragraph>{descricao}</Paragraph> : null}
      {contexto ? (
        <Paragraph>
          <Text strong>{contexto}</Text>
        </Paragraph>
      ) : null}
      {children}
    </Drawer>
  );
}

export default PainelLateral;
