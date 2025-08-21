import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import React, { useState } from "react";
import type { TableProps } from "antd";
import {
  Button,
  Flex,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType, TableRowSelection } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "styled-components";
import type { IUnidadeEscolar } from "../../../../../services/resources/convocacao/IConvocacao";
import { StyledTable } from "./style";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof IUnidadeEscolar;
  title: any;
  record: IUnidadeEscolar;
  control: any;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  record,
  control,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Controller
          name={`${record.uuid}.${dataIndex}`}
          control={control}
          rules={{ required: `${title} é obrigatório` }}
          render={({ field }) => (
            <InputNumber {...field} min={0} style={{ width: "100%" }} />
          )}
        />
      ) : (
        children
      )}
    </td>
  );
};

interface AdicionarEscolaTableProps extends TableProps<IUnidadeEscolar> {
 }

const AdicionarEscolaTable: React.FC<AdicionarEscolaTableProps> = ({
   ...rest
}) => {
  const { control, getValues } = useForm({    
  });

  const [data, setData] = useState<IUnidadeEscolar[]>([ {
              uuid: "1",
             
              eol: "string",
              dre: "string",
              tipo: "string",
              unidade: "string",
              vagas_definitivas: 1,
              vagas_precarias: 1,
            },
            {
              uuid: "2",
             
              eol: "string",
              dre: "string",
              tipo: "string",
              unidade: "string",
              vagas_definitivas: 1,
              vagas_precarias: 1,
            },]);
  const [editingKey, setEditingKey] = useState("");
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>( [
           
  //         ]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const isEditing = (record: IUnidadeEscolar) => record.uuid === editingKey;

  const edit = (record: IUnidadeEscolar) => {
    setEditingKey(record.uuid);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = (key: React.Key) => {
    const values = getValues(`${key}`);
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.uuid);

    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...values });
      setData(newData);
      setEditingKey("");
    }
  };

  const columns: TableColumnsType<IUnidadeEscolar> = [
    // { title: "Código EOL", dataIndex: "eol" },
    { title: "DRE", dataIndex: "dre" },
    { title: "Tipo de unidade", dataIndex: "tipo" },
    { title: "Unidade Escolar", dataIndex: "unidade" },
    {
      title: "Vagas definitivas",
      dataIndex: "vagas_definitivas",
      editable: true,
    },
    {
      title: "Vagas precárias",
      dataIndex: "vagas_precarias",
      editable: true,
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_: any, record: IUnidadeEscolar) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.uuid)}
              style={{ marginInlineEnd: 8 }}
            >
              Salvar
            </Typography.Link>
            <Popconfirm title="Cancelar edição?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="small">
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              type="link"
              icon={
                <ModeEditOutlineOutlinedIcon
                  style={{ color: theme.token.colorPrimary }}
                />
              }
            />
          </Space>
        );
      },
    },
  ];

  // const mergedColumns: TableProps<IUnidadeEscolar>["columns"] = columns.map(
  //   (col) => {
  //     if (!(col as any).editable) return col;
  //     return {
  //       ...col,
  //       onCell: (record: IUnidadeEscolar) => ({
  //         record,
  //         dataIndex: col.dataIndex,
  //         title: col.title,
  //         editing: isEditing(record),
  //         control,
  //       }),
  //     };
  //   }
  // );

  // const rowSelection: TableRowSelection<IUnidadeEscolar> = {
  //   selectedRowKeys,
  //   onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  // };

 
 

  return (
    <Flex gap="middle" vertical>

      <StyledTable<IUnidadeEscolar>
        {...rest}
         rowKey="uuid" 
        style={{ margin: "1.5rem 0" }}
        components={{
          body: { cell: EditableCell },
        }}
        // rowSelection={rowSelection}
        bordered
        dataSource={data}
        // columns={mergedColumns}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Flex>
  );
};

export default AdicionarEscolaTable;
