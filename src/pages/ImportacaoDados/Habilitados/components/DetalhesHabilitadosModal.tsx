import React from "react";
import { Modal, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import { AppButton, ErrorModalButtonsContainer as ButtonsContainer } from "@/components/ui";
import type { IUltimasImportacoesHabilitados } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";
import { formatarStatusImportacao } from "../../utils/statusImportacao";

interface DetalhesHabilitadosModalProps {
  open: boolean;
  onClose: () => void;
  record: IUltimasImportacoesHabilitados | null;
}

const DetalhesHabilitadosModal: React.FC<DetalhesHabilitadosModalProps> = ({
  open,
  onClose,
  record,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={"43.75rem"}
      centered
      title={
        <Typography.Text strong style={{ fontSize: 16 }}>
          Detalhes da Importação
        </Typography.Text>
      }
    >
      <Descriptions
        bordered
        column={1}
        size="small"
        labelStyle={{ fontWeight: 600, width: "30%" }}
      >
        <Descriptions.Item label="Concurso">
          {record?.concurso_nome || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Arquivo">
          {record?.nome_arquivo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Data e Hora">
          {record?.criado_em
            ? dayjs(record.criado_em).format("DD/MM/YYYY HH:mm")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {formatarStatusImportacao(record?.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Quantidade">
          {record?.quantidade ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Observação">
          <span style={{ whiteSpace: "pre-wrap" }}>
            {record?.observacao || "-"}
          </span>
        </Descriptions.Item>
      </Descriptions>

      <ButtonsContainer>
        <AppButton variant="secondary" onClick={onClose}>
          Fechar
        </AppButton>
      </ButtonsContainer>
    </Modal>
  );
};

export default DetalhesHabilitadosModal;
