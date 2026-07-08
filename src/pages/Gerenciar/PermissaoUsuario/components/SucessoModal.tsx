import React from "react";
import { Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { AppButton, confirmationModalStyles, confirmationModalWidth } from '@/components/ui';
import type { SucessoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

const SucessoModal: React.FC<SucessoModalProps> = ({ open, texto, onOk }) => {
  const s = confirmationModalStyles;

  return (
    <Modal
      open={open}
      title="Modal Sucesso"
      onCancel={onOk}
      centered
      width={confirmationModalWidth}
      footer={
        <div style={s.footerCenteredSingle}>
          <AppButton
            variant="primary"
            size="large"
            style={s.confirmButton}
            onClick={onOk}
          >
            Ok
          </AppButton>
        </div>
      }
      styles={s.antdStyles}
    >
      <div style={s.contentColumn}>
        <CheckCircleFilled style={s.successIconLarge} />

        <div style={s.singleTitleText}>
          {texto}
        </div>
      </div>
    </Modal>
  );
};

export default SucessoModal;
