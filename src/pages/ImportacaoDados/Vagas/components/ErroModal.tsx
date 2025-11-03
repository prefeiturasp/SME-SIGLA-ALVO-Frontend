import React from "react";
import { Modal, Typography, Input, Row, Col, Button, Spin } from "antd";

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
      title={
        <Typography.Text style={{ fontSize: 16 }}>
          Erros da Importação
        </Typography.Text>
      }
    >
      <Spin spinning={false}>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Typography.Text strong>Mensagem:</Typography.Text>
            <Input.TextArea
              rows={3}
              value={importacaoErro?.mensagem || ""}
              placeholder="Mensagem de erro resumida"
              readOnly
              style={{ marginTop: 8 }}
            />
          </Col>
          <Col span={24}>
            <Typography.Text strong>Erro:</Typography.Text>
            <div
              style={{
                marginTop: 8,
                padding: "4px 11px",
                minHeight: "146px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fff",
                whiteSpace: "pre-line",
                fontSize: "14px",
                lineHeight: "1.5715",
              }}
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
        </Row>
      </Spin>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="primary" 
          onClick={onDownload}
          loading={isDownloading}
          disabled={!importacaoErro}
        >
          Download
        </Button>
      </div>
    </Modal>
  );
};

export default ErroModal;

