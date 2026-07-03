import { Table, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IConcursoLista } from "../../../../services/resources/concursos/IConcursos";

interface ITabelaProps {
  dados: IConcursoLista[];
  total: number;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEditar: (uuid: string) => void;
}

const TabelaConcursos: React.FC<ITabelaProps> = ({
  dados,
  total,
  page,
  loading,
  onPageChange,
  onEditar,
}) => {
  const colunas: ColumnsType<IConcursoLista> = [
    { title: "Nome do concurso", dataIndex: "nome", key: "nome" },
    {
      title: "Código e descrição do cargo",
      key: "cargos_descricao",
      render: (_, row) => row.cargos_descricao.join(", "),
    },
    { title: "Nº do processo", dataIndex: "numero_processo", key: "numero_processo" },
    { title: "Ano edital", dataIndex: "ano_edital", key: "ano_edital" },
    { title: "Banca responsável", dataIndex: "banca_responsavel", key: "banca_responsavel" },
    {
      title: "Status",
      key: "status",
      render: (_, row) => (row.status === "ATIVO" ? "Ativo" : "Inativo"),
    },
    {
      title: "",
      key: "acoes",
      width: 48,
      render: (_, row) => (
        <Tooltip title="Editar">
          <EditOutlined
            style={{ cursor: "pointer", color: "#1677ff" }}
            onClick={() => onEditar(row.uuid)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table<IConcursoLista>
      rowKey="uuid"
      columns={colunas}
      dataSource={dados}
      loading={loading}      
      locale={{ emptyText: "Não encontramos dados para esta busca" }}
      pagination={{
        current: page,
        pageSize: 10,
        total,
        showSizeChanger: false,
        onChange: onPageChange,
        showTotal: (t, range) => (
          <strong>{`Mostrando ${range[0]}-${range[1]} de ${t} registro(s)`}</strong>
        ),
      }}
    />
  );
};

export default TabelaConcursos;
