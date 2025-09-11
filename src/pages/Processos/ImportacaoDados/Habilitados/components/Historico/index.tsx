import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Space, Typography } from "antd";
import { StyledTable, SecondaryButton } from "../../../../../../components/estilosCompartilhados/styles";
import { useImportacaoDados } from "../../hooks/useImportacaoDados";

const { Title } = Typography;

interface HistoricoProps extends TableProps<any> {
  data?: any[];
  onVoltar?: () => void;
}

const Historico: React.FC<HistoricoProps> = ({ data, onVoltar, ...rest }) => {
  const {
    importacoesArquivos,
    importacoesArquivosIsLoading,
  } = useImportacaoDados();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      console.log("Voltar");
    }
  };

  const handleSalvar = () => {
    console.log("Salvar arquivo");
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
      dataIndex: "concurso",
      key: "concurso",
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

      <StyledTable
        columns={columns}
        dataSource={importacoesArquivos?.results || []}
        rowKey={(record) => `${record.id}`}
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="historico-table"
        loading={importacoesArquivosIsLoading}
        pagination={{
          current: importacoesArquivos?.page, 
          pageSize: 10,
          defaultPageSize: 10,
          position: ["bottomLeft"],
          total: importacoesArquivos?.count,
          showTotal: (total, range) => (
            <span style={{ marginLeft: 16 }}>
              {`Mostrando ${range[0]}-${range[1]} de ${total} registro(s)`}
            </span>
          ),
        }}
        {...rest}
      />

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <SecondaryButton size="large" onClick={handleVoltar}>
          Voltar
        </SecondaryButton>
      </div>
    </>
  );
};

export default Historico;
