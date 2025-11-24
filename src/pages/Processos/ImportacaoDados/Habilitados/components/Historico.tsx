import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Space, Typography } from "antd";
import { StyledTable } from "../../../../../components/EstilosCompartilhados";
import { useImportacaoDados } from "../hooks/useImportacaoDados";



const { Title } = Typography;

interface HistoricoProps extends TableProps<any> {
  data?: any[];
  onVoltar?: () => void;
}

const HistoricoHabilitadosModal: React.FC<HistoricoProps> = ({ data, onVoltar, ...rest }) => {
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


  const handleDelete = (id: string) => {
    console.log("Delete", id);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Data",
      dataIndex: "criado_em",
      key: "criado_em",
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Concurso",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
    },
    {
      title: "Arquivo",
      dataIndex: "arquivo",
      key: "arquivo",
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
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={4} style={{ margin: "1rem 0" }}>
        Histórico
      </Title>

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
              {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
            </span>
          ),
        }}
        onChange={onAntTableChange}
        {...rest}
      />

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button
          type="primary"
          ghost
          size="large"
          onClick={handleVoltar}
          style={{
            fontWeight: 700,
            borderRadius: '0.375rem'
          }}
        >
          Voltar
        </Button>
      </div>
    </>
  );
};

export default HistoricoHabilitadosModal;
