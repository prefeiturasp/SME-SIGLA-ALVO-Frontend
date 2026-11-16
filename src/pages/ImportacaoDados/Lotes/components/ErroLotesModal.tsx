import React from "react";
import { Modal, Typography, Col } from "antd";
import { AppButton } from '@/components/ui';
import {
  ErrorModalRow as StyledRow,
  ErrorModalTextArea as StyledTextArea,
  ErrorModalContainer as ErroContainer,
  ErrorModalButtonsContainer as ButtonsContainer,
} from "@/components/ui";

interface ErroLotesModalProps {
  open: boolean;
  onClose: () => void;
  importacaoErro: {
    mensagem: string;
    erros: string;
  } | null;
}

const ErroLotesModal: React.FC<ErroLotesModalProps> = ({ open, onClose, importacaoErro }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={<Typography.Text strong style={{ fontSize: 16 }}>Erro da Importação</Typography.Text>}
    >
      <StyledRow gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Text strong>Mensagem:</Typography.Text>
          <StyledTextArea
            rows={3}
            value={importacaoErro?.mensagem || ""}
            placeholder="Mensagem de erro resumida"
            readOnly
          />
        </Col>
        <Col span={24}>
          <Typography.Text strong>Erro:</Typography.Text>
          <ErroContainer
            dangerouslySetInnerHTML={{
              __html: importacaoErro?.erros
                ? importacaoErro.erros
                    .split(" | ")
                    .map((parte: string) =>
                      parte.replace(/^([^:]+:)/, "<strong>$1</strong>")
                    )
                    .join("<br/>")
                : "",
            }}
          />
        </Col>
      </StyledRow>
      <ButtonsContainer>
        <AppButton variant="secondary" onClick={onClose}>Fechar</AppButton>
      </ButtonsContainer>
    </Modal>
  );
};

export default ErroLotesModal;
