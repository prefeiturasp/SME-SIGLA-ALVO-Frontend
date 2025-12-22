import React from "react";
import { Button, Modal } from "antd";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";

import { ClearButton } from "../../../Processos/ConvocacaoCandidatos/style";
import type { AtivacaoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

const AtivacaoModal: React.FC<AtivacaoModalProps> = ({
  open,
  mode,
  nomeUsuario,
  step = "confirm",
  onCancel,
  onConfirm,
  onOk,
}) => {
  const isAtivar = mode === "ativar";
  const titulo = isAtivar ? "Ativar usuário" : "Desativar usuário";
  const texto = isAtivar ? "Tem certeza que deseja ativar" : "Tem certeza que deseja desativar";
  const cta = isAtivar ? "Ativar usuário" : "Desativar usuário";

  return (
    <Modal
      open={open}
      title={step === "success" ? "Sucesso" : titulo}
      onCancel={onCancel}
      centered
      width={720}
      footer={
        step === "success" ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <Button
              size="large"
              type="primary"
              style={{ width: 260, height: 52 }}
              onClick={onOk ?? onCancel}
            >
              Ok
            </Button>
          </div>
        ) : (
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
              {cta}
            </Button>
          </div>
        )
      }
      styles={{
        body: { padding: "28px 24px 8px 24px" },
        footer: { padding: "18px 24px 28px 24px" },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {step === "success" ? (
          <CheckCircleFilled style={{ fontSize: 92, color: "#51B05B" }} />
        ) : (
          <WarningFilled style={{ fontSize: 72, color: "#F5B800" }} />
        )}

        <div
          style={{
            textAlign: "center",
            fontFamily: "Open Sans",
            fontSize: 28,
            lineHeight: "36px",
            color: "#111111",
          }}
        >
          {step === "success" ? (
            <>
              Usuário <strong>{isAtivar ? "ativado" : "desativado"}</strong> com sucesso!
            </>
          ) : (
            <>
              {texto} <br />o usuário <strong>{nomeUsuario ?? ""}</strong>?
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AtivacaoModal;
