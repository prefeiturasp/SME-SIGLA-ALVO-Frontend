import React from "react";
import { Modal } from "antd";
import { WarningFilled } from "@ant-design/icons";
import { AppButton, confirmationModalStyles, confirmationModalWidth } from '@/components/ui';

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
  const s = confirmationModalStyles;

  return (
    <Modal
      open={open}
      title="Excluir autorização"
      onCancel={onCancel}
      centered
      width={confirmationModalWidth}
      footer={
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
            Excluir
          </AppButton>
        </div>
      }
      styles={s.antdStyles}
    >
      <div style={s.contentColumn}>
        <WarningFilled style={s.warningIconWarning} />

        <div style={s.singleTitleText}>
          Tem certeza que deseja excluir?
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmarExclusaoModal;
