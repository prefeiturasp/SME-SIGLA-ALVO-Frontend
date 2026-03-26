import React from "react";
import { Modal, Typography, Col, Button } from "antd";
import { StyledRow, StyledTextArea, ErroContainer, ButtonsContainer } from "../../Vagas/components/style";

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
        <Button onClick={onClose}>Fechar</Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default ErroLotesModal;
