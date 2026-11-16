import React from "react";
import { Modal } from "antd";
import { WarningFilled } from "@ant-design/icons";

import { AppButton, ClearButton, confirmationModalStyles, confirmationModalWidth } from '@/components/ui';

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
  const s = confirmationModalStyles;

  return (
    <Modal
      open={open}
      title="Excluir processo"
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
            danger
            size="large"
            style={s.confirmButton}
            onClick={onConfirm}
            loading={confirmLoading}
            disabled={confirmLoading}
          >
            Excluir
          </AppButton>
        </div>
      }
      styles={s.antdStyles}
    >
      <div style={s.contentColumn}>
        <WarningFilled style={s.warningIconDanger} />

        <div style={s.messageBlock}>
          <span style={s.titleText}>
            Tem certeza que deseja excluir o processo?
          </span>
          <span style={s.subtitleText}>
            Essa ação é irreversível e removerá o processo definitivamente.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmarExclusaoProcessoModal;
