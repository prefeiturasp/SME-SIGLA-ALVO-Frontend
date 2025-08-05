import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import type { INewProductForm } from "../../../services/resources/products/IProduct";
import {
  CustomLink,
  CustomTitle,
  Icon,
  DeleteLink,
  StyledTable,
  DeleteButton,
  EditButton,
} from "./style";
import { DeleteOutlined, EditFilled, EditOutlined } from "@ant-design/icons";
import { Button, Image, Typography } from "antd";

 
 
const { Title } = Typography;

interface ConvocacaoTableProps extends TableProps<INewProductForm> {
  data: INewProductForm[];
}

const ConvocacaoTable: React.FC<ConvocacaoTableProps> = ({ data, ...rest }) => {
  const columns: ColumnsType<INewProductForm> = [
    {
      title: "Processo",
      dataIndex: "concurso",
      key: "concurso",
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Data Inicial",
      dataIndex: "data_inicial",
      key: "data_inicial",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Data Final",
      dataIndex: "data_final",
      key: "data_final",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (active ? "Ativo" : "Inativo"),
    },
    {
      width: "12%",
      title: "Ações",
      dataIndex: "",
      key: "x",
      render: (row) => (
        <div style={{ display: "flex", gap: "1rem",  }}>
 
          <EditButton
            type={"default"}
            icon={<Icon onClick={() => console.log("edit")}>edit</Icon>}
            disabled={false}
          />

 
          <DeleteButton
            type={"default"}
            icon={              
                <Icon onClick={() => console.log("delete")}>delete</Icon>              
            }
            disabled={false}
            onClick={() => console.log(row)}
          />

          <CustomLink onClick={() => console.log(row)}>Finalizar</CustomLink>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomTitle level={4} style={{ margin: "2.375rem  0 1rem 0" }}>
        {"Resultados"}
      </CustomTitle>

 
      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.concurso}-${record.cargo}`}
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
