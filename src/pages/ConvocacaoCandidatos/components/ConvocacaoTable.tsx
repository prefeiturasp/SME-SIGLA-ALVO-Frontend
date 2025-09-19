import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import type { IProcessoConvocacao } from "../../../services/resources/convocacao/IConvocacao";
import { CustomTitle } from "./style";

import { Button, Space } from "antd";
import { StyledTable } from "../../../components/EstilosCompartilhados";

interface ConvocacaoTableProps extends TableProps<IProcessoConvocacao> {
  data: IProcessoConvocacao[];
}
const ConvocacaoTable: React.FC<ConvocacaoTableProps> = ({ data, ...rest }) => {
  const columns: ColumnsType<IProcessoConvocacao> = [
    {
      title: "Processo",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
    },

    {
      title: "Data de Convocação",
      dataIndex: "data_convocacao",
      key: "data_convocacao",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      width: "12%",
      title: "Ações",
      dataIndex: "",
      key: "x",
      render: (row) => (
        <Space size="small">
          <Button
            type={"link"}
            icon={<ModeEditOutlineOutlinedIcon />}
            onClick={() => console.log("edit")}
          />

          <Button
            type={"link"}
            danger
            icon={<DeleteOutlineOutlinedIcon />}
            onClick={() => console.log("delete")}
          />

          <Button
            color="primary"
            variant="link"
            onClick={() => console.log(row)}
          >
            Finalizar
          </Button>
        </Space>
      ),
    },
  ];

 
  return (
    <>

      <CustomTitle level={4} style={{ margin: "1rem 0" }}>
        {"Resultados"}
      </CustomTitle>

      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.uuid}`}
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="convocacao-table"
        {...rest}
      />
    </>
  );
};

export default ConvocacaoTable;
