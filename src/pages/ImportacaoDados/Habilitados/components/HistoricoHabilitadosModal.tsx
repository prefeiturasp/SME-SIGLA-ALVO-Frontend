import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Layout, Modal, Space, Typography } from "antd";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import { useImportacaoDados } from "../hooks/useImportacaoDadosHabilitados";
import { deleteIcon } from "../../../../components/EstilosCompartilhados";

const { Title } = Typography;

interface HistoricoProps extends TableProps<any> {
  data?: any[];
  onVoltar?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoricoHabilitadosModal: React.FC<HistoricoProps> = ({
  data,
  onVoltar,
  isOpen,
  onClose,
  ...rest
}) => {
  const {
    importacoesArquivos,
    importacoesArquivosIsLoading,
    listRequest,
    onAntTableChange,
  } = useImportacaoDados();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      console.log("Voltar");
    }
  };

  const handleDelete = (uuid: string) => {
    console.log("Delete", uuid);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Data",
      dataIndex: "criado_em",
      key: "criado_em",
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Concurso",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
    },
    {
      title: "Arquivo",
      dataIndex: "nome_arquivo",
      key: "nome_arquivo",
      render: (text: string) => text || "-",
    },
    {
      width: "12%",
      title: "Ações",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space size="small">          
          <Button
            type={"link"}
            icon={<DeleteOutlined style={deleteIcon} />}
            onClick={() => handleDelete(record.uuid)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={
        <Typography.Text style={{ fontSize: 16 }}>
          Histórico de Importações da Fundação
        </Typography.Text>
      }
    >
      <StyledTable<any>
        columns={columns}
        dataSource={importacoesArquivos?.results || []}
        rowKey="id"
        bordered
        rowClassName={(_: any, index: number) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="historico-table"
        loading={importacoesArquivosIsLoading}
        pagination={{
          current: listRequest.pagination.page,
          pageSize: 10,
          defaultPageSize: 10,
          position: ["bottomLeft"],
          total: importacoesArquivos?.count,
          showTotal: (total: number, range: [number, number]) => (
            <span style={{ marginLeft: 16 }}>
              {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
            </span>
          ),
        }}
        onChange={onAntTableChange}
        {...rest}
      />
    </Modal>
  );
};

export default HistoricoHabilitadosModal;
