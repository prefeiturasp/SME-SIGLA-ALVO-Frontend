import React from "react";
import { Modal } from "antd";
import { WarningFilled } from "@ant-design/icons";

import { AppButton, ClearButton, confirmationModalStyles, confirmationModalWidth } from '@/components/ui';

export interface FinalizarProcessoModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const FinalizarProcessoModal: React.FC<FinalizarProcessoModalProps> = ({
  open,
  confirmLoading = false,
  onCancel,
  onConfirm,
}) => {
  const s = confirmationModalStyles;

  return (
    <Modal
      open={open}
      title="Finalizar processo"
      onCancel={onCancel}
      centered
      closable={!confirmLoading}
      maskClosable={!confirmLoading}
      width={confirmationModalWidth}
      footer={
        <div style={s.footerCentered}>
          <ClearButton
            size="large"
            style={s.cancelButton}
            onClick={onCancel}
            disabled={confirmLoading}
          >
            Cancelar
          </ClearButton>
          <AppButton
            variant="primary"
            size="large"
            style={s.confirmButton}
            onClick={onConfirm}
            loading={confirmLoading}
            disabled={confirmLoading}
          >
            Finalizar
          </AppButton>
        </div>
      }
      styles={s.antdStyles}
    >
      <div style={s.contentColumn}>
        <WarningFilled style={s.warningIconWarning} />

        <div style={s.messageBlock}>
          <span style={s.titleText}>
            Tem certeza que deseja finalizar o processo?
          </span>
          <span style={s.subtitleText}>
            Ao realizar essa ação só será permitido a visualização do processo.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default FinalizarProcessoModal;
