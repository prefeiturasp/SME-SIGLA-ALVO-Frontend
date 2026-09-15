import { Button } from "antd";
import type { ReactNode } from "react";
import { ModalPadrao } from "@locus/estilos";

export interface ModalBaseProps {
  aberto: boolean;
  titulo: string;
  mensagem: ReactNode;
  textoConfirmar: string;
  textoCancelar?: string;
  perigo?: boolean;
  iconeConfirmar?: ReactNode;
  confirmando?: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void;
  textoAcaoExtra?: string;
  aoAcaoExtra?: () => void;
  confirmandoAcaoExtra?: boolean;
}

/** Modal base de confirmacao padrao do Locus. */
export function ModalBase({
  aberto,
  titulo,
  mensagem,
  textoConfirmar,
  textoCancelar = "Cancelar",
  perigo = false,
  iconeConfirmar,
  confirmando = false,
  aoConfirmar,
  aoCancelar,
  textoAcaoExtra,
  aoAcaoExtra,
  confirmandoAcaoExtra = false,
}: ModalBaseProps) {
  const botoes = [
    <Button key="cancelar" type="default" onClick={aoCancelar}>
      {textoCancelar}
    </Button>,
    <Button
      key="confirmar"
      type="default"
      danger={perigo}
      loading={confirmando}
      icon={iconeConfirmar}
      onClick={aoConfirmar}
    >
      {textoConfirmar}
    </Button>,
  ];

  if (textoAcaoExtra && aoAcaoExtra) {
    botoes.push(
      <Button
        key="acao-extra"
        type="primary"
        loading={confirmandoAcaoExtra}
        onClick={aoAcaoExtra}
      >
        {textoAcaoExtra}
      </Button>,
    );
  }

  return (
    <ModalPadrao
      open={aberto}
      title={titulo}
      onCancel={aoCancelar}
      destroyOnHidden
      footer={botoes}
    >
      {mensagem}
    </ModalPadrao>
  );
}

export default ModalBase;
