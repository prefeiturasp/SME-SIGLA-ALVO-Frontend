import React from "react";
import { Modal, Typography, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ButtonsContainer } from "../../Vagas/components/style";
import { Button } from "antd";
import type { IDetalheLoteAtualizado } from "../hooks/types";

interface DetalhesLotesModalProps {
  open: boolean;
  onClose: () => void;
  detalhes: IDetalheLoteAtualizado[] | null;
}

const columns: ColumnsType<IDetalheLoteAtualizado> = [
  {
    title: "Lote",
    dataIndex: "lote",
    key: "lote",
    align: "center",
  },
  {
    title: "Empresa",
    dataIndex: "empresa",
    key: "empresa",
    align: "center",
  },
  {
    title: "Vaga",
    dataIndex: "vaga",
    key: "vaga",
    align: "center",
  },
  {
    title: "Identificação",
    dataIndex: "identificacao",
    key: "identificacao",
    align: "center",
  },
  {
    title: "Chave Inscrito",
    dataIndex: "chave_inscrito",
    key: "chave_inscrito",
    align: "center",
  },
  {
    title: "Reg. Funcional",
    dataIndex: "numfunc",
    key: "numfunc",
    align: "center",
    render: (value: string) => value || "-",
  },
  {
    title: "Vínculo",
    dataIndex: "numvinc",
    key: "numvinc",
    align: "center",
    render: (value: string) => value || "-",
  },
];

const DetalhesLotesModal: React.FC<DetalhesLotesModalProps> = ({ open, onClose, detalhes }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={
        <Typography.Text strong style={{ fontSize: 16 }}>
          Detalhes da Importação
        </Typography.Text>
      }
    >
      <Table<IDetalheLoteAtualizado>
        columns={columns}
        dataSource={detalhes || []}
        rowKey={(_, index) => String(index)}
        bordered
        size="small"
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => (
            <span>{`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}</span>
          ),
        }}
        scroll={{ x: true }}
      />
      <ButtonsContainer>
        <Button onClick={onClose}>Fechar</Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default DetalhesLotesModal;
