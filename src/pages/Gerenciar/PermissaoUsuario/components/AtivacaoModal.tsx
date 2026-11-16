import React from "react";
import { Modal } from "antd";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";
import { AppButton, confirmationModalStyles, confirmationModalWidth } from '@/components/ui';
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
  const s = confirmationModalStyles;

  return (
    <Modal
      open={open}
      title={step === "success" ? "Sucesso" : titulo}
      onCancel={onCancel}
      centered
      width={confirmationModalWidth}
      footer={
        step === "success" ? (
          <div style={s.footerCenteredSingle}>
            <AppButton
              variant="primary"
              size="large"
              style={s.confirmButton}
              onClick={onOk ?? onCancel}
            >
              Ok
            </AppButton>
          </div>
        ) : (
          <div style={s.footerCentered}>
            <AppButton
              variant="secondary"
              size="large"
              style={s.cancelButton}
              onClick={onCancel}
            >
              Cancelar
            </AppButton>
            <AppButton
              variant="primary"
              size="large"
              style={s.confirmButton}
              onClick={onConfirm}
            >
              {cta}
            </AppButton>
          </div>
        )
      }
      styles={s.antdStyles}
    >
      <div style={s.contentColumn}>
        {step === "success" ? (
          <CheckCircleFilled style={s.successIconLarge} />
        ) : (
          <WarningFilled style={s.warningIconWarning} />
        )}

        <div style={s.singleTitleText}>
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
