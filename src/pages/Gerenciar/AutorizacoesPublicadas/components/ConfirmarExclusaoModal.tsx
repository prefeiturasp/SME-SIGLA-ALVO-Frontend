import React from "react";
import { Button, Modal } from "antd";
import { WarningFilled } from "@ant-design/icons";

import { ClearButton } from "../../../Processos/ConvocacaoCandidatos/style";

type ConfirmarExclusaoModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmarExclusaoModal: React.FC<ConfirmarExclusaoModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      title="Excluir autorização"
      onCancel={onCancel}
      centered
      width={720}
      footer={
        <div style={{ display: "flex", justifyContent: "center", gap: 48, paddingTop: 8 }}>
          <ClearButton
            size="large"
            style={{ width: 220, height: 52, marginTop: 0 }}
            onClick={onCancel}
          >
            Cancelar
          </ClearButton>
          <Button
            size="large"
            type="primary"
            style={{ width: 260, height: 52 }}
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      }
      styles={{
        body: { padding: "28px 24px 8px 24px" },
        footer: { padding: "18px 24px 28px 24px" },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <WarningFilled style={{ fontSize: 72, color: "#F5B800" }} />

        <div
          style={{
            textAlign: "center",
            fontFamily: "Open Sans",
            fontSize: 28,
            lineHeight: "36px",
            color: "#111111",
          }}
        >
          Tem certeza que deseja excluir?
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmarExclusaoModal;

