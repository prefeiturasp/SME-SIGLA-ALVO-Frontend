import React from "react";
import { Modal, Typography, Col, Button } from "antd";
import { StyledRow, StyledTextArea, ButtonsContainer } from "../../Vagas/components/style";

interface ErroLotesModalProps {
  open: boolean;
  onClose: () => void;
  erroTexto: string | null;
}

const ErroLotesModal: React.FC<ErroLotesModalProps> = ({ open, onClose, erroTexto }) => {
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
          <Typography.Text strong>Detalhe do erro:</Typography.Text>
          <StyledTextArea
            rows={5}
            value={erroTexto || "Sem detalhes disponíveis."}
            readOnly
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
