import React from "react";
import { Modal, Typography, Col, Button, Spin } from "antd";
import {
  ModalTitle,
  StyledRow,
  StyledTextArea,
  ErroContainer,
  ButtonsContainer,
} from "./style";

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
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="primary" 
          onClick={onDownload}
          loading={isDownloading}
          disabled={!importacaoErro}
        >
          Download
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default ErroModal;

