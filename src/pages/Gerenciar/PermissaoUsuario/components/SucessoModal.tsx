import React from "react";
import { Button, Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import type { SucessoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

const SucessoModal: React.FC<SucessoModalProps> = ({ open, texto, onOk }) => {
  return (
    <Modal
      open={open}
      title="Modal Sucesso"
      onCancel={onOk}
      centered
      width={720}
      footer={
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <Button
            size="large"
            type="primary"
            style={{ width: 260, height: 52 }}
            onClick={onOk}
          >
            Ok
          </Button>
        </div>
      }
      styles={{
        body: { padding: "28px 24px 8px 24px" },
        footer: { padding: "18px 24px 28px 24px" },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <CheckCircleFilled style={{ fontSize: 92, color: "#51B05B" }} />

        <div
          style={{
            textAlign: "center",
            fontFamily: "Open Sans",
            fontSize: 28,
            lineHeight: "36px",
            color: "#111111",
          }}
        >
          {texto}
        </div>
      </div>
    </Modal>
  );
};

export default SucessoModal;

