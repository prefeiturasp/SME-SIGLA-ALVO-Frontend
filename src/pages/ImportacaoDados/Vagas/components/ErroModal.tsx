import React from "react";
import { Modal, Typography, Col, Spin } from "antd";
import { AppButton } from '@/components/ui';
import {
  ErrorModalTitle as ModalTitle,
  ErrorModalRow as StyledRow,
  ErrorModalTextArea as StyledTextArea,
  ErrorModalContainer as ErroContainer,
  ErrorModalButtonsContainer as ButtonsContainer,
} from "@/components/ui";

interface ErroModalProps {
  open: boolean;
  onClose: () => void;
  importacaoErro: {
    mensagem: string;
    erros: string;
  } | null;
  onDownload: () => void;
  isDownloading: boolean;
}

const ErroModal: React.FC<ErroModalProps> = ({
  open,
  onClose,
  importacaoErro,
  onDownload,
  isDownloading,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={<ModalTitle>Erros da Importação</ModalTitle>}
    >
      <Spin spinning={false}>
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
                      .map((parte: string) => {
                        return parte.replace(
                          /^([^:]+:)/,
                          '<strong>$1</strong>'
                        );
                      })
                      .join("<br/>")
                  : "",
              }}
            />
          </Col>
        </StyledRow>
      </Spin>
      <ButtonsContainer>
        <AppButton variant="secondary" onClick={onClose}>Cancelar</AppButton>
        <AppButton 
          onClick={onDownload}
          loading={isDownloading}
          disabled={!importacaoErro}
        >
          Download
        </AppButton>
      </ButtonsContainer>
    </Modal>
  );
};

export default ErroModal;

