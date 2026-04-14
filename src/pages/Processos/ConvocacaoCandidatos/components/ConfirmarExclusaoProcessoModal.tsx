import React from "react";
import { Button, Modal } from "antd";
import { WarningFilled } from "@ant-design/icons";

import { ClearButton } from "../style";

export interface ConfirmarExclusaoProcessoModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmarExclusaoProcessoModal: React.FC<ConfirmarExclusaoProcessoModalProps> = ({
  open,
  confirmLoading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      title="Excluir processo"
      onCancel={onCancel}
      centered
      closable={!confirmLoading}
      maskClosable={!confirmLoading}
      width={720}
      footer={
        <div style={{ display: "flex", justifyContent: "center", gap: 48, paddingTop: 8 }}>
          <ClearButton
            size="large"
            style={{ width: 220, height: 52, marginTop: 0 }}
            onClick={onCancel}
            disabled={confirmLoading}
          >
            Cancelar
          </ClearButton>
          <Button
            size="large"
            type="primary"
            danger
            style={{ width: 260, height: 52 }}
            onClick={onConfirm}
            loading={confirmLoading}
            disabled={confirmLoading}
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
        <WarningFilled style={{ fontSize: 72, color: "#F5222D" }} />

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontFamily: "Open Sans",
              fontSize: 28,
              lineHeight: "36px",
              color: "#111111",
            }}
          >
            Tem certeza que deseja excluir o processo?
          </span>
          <span
            style={{
              fontFamily: "Open Sans",
              fontSize: 20,
              lineHeight: "28px",
              color: "#111111",
            }}
          >
            Essa ação é irreversível e removerá o processo definitivamente.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmarExclusaoProcessoModal;

