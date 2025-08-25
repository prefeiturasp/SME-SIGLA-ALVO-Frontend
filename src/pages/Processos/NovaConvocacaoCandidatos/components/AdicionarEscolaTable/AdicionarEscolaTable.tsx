import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
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
  Tooltip,
} from "antd";
import type { TableColumnsType } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "styled-components";
import type { IUnidadeEscolar } from "../../../../../services/resources/convocacao/IConvocacao";
import { StyledTable } from "../../../../../components/estilosCompartilhados/styles";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof IUnidadeEscolar;
  title: any;
  record?: IUnidadeEscolar;
  control?: any;
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
          name={`${record?.uuid}.${dataIndex}`}
          control={control}
          rules={{ required: `${title} é obrigatório` }}
          render={({ field }) => (
            <InputNumber {...field} min={0} controls={false} style={{ width: 80 }} />
          )}
        />
      ) : (
        children
      )}
    </td>
  );
};

interface AdicionarEscolaTableProps extends TableProps<IUnidadeEscolar> {}

const AdicionarEscolaTable: React.FC<AdicionarEscolaTableProps> = ({
  ...rest
}) => {
  const { control, getValues } = useForm({});
  const [data, setData] = useState<IUnidadeEscolar[]>([
      {
        uuid: "3b178725-a14a-42d7-97cc-4fb1e3837f5b",
        eol: "480100",
        dre: "Guaianases",
        tipo: "UE",
        unidade: "Escola Guaianases",
        vagas_definitivas: 1,
        vagas_precarias: 1,
      },
      {
        uuid: "e81d73ef-5121-4237-9bcd-69d174354051",
        eol: "480100",
        dre: "Guaianases",
        tipo: "UE",
        unidade: "Escola Campo Limpo",
        vagas_definitivas: 1,
        vagas_precarias: 1,
      },
    ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const theme = useTheme();

  const isEditing = (record: IUnidadeEscolar) => record.uuid === editingKey;

  const edit = (record: IUnidadeEscolar) => setEditingKey(record.uuid);
  const cancel = () => setEditingKey("");
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
    { title: "Código EOL", dataIndex: "eol" },
    { title: "DRE", dataIndex: "dre" },
    { title: "Tipo de unidade", dataIndex: "tipo" },
    { title: "Unidade Escolar", dataIndex: "unidade" },
    {
      title: "Vagas definitivas",
      dataIndex: "vagas_definitivas",
      editable: true,
    } as any,
    {
      title: "Vagas precárias",
      dataIndex: "vagas_precarias",
      editable: true,
    } as any,
    {
      title: "Ações",
      key: "acoes",
      width: 64,
      align: "center" as const,
      render: (_: any, record: IUnidadeEscolar) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{ width: 56, display: "flex", justifyContent: "center", gap: 2 }}>
            <Tooltip title="Salvar">
              <Button
                type="link"
                onClick={() => save(record.uuid)}
                icon={<CheckOutlined style={{ color: theme.token.colorPrimary }} />}
              />
            </Tooltip>
            <Tooltip title="Cancelar">
              <Button
                type="link"
                onClick={cancel}
                icon={<CloseOutlined style={{ color: "#ff4d4f" }} />}
              />
            </Tooltip>
          </div>
        ) : (
          <div style={{ width: 56, display: "flex", justifyContent: "center", gap: 2 }}>
            <Tooltip title="Editar vagas">
              <Button
                type="link"
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
                icon={
                  <ModeEditOutlineOutlinedIcon
                    style={{ color: theme.token.colorPrimary }}
                  />
                }
              />
            </Tooltip>
            <Button type="link" style={{ visibility: "hidden" }} icon={<CloseOutlined />} />
          </div>
        );
      },
    },
  ];

  const mergedColumns: TableProps<IUnidadeEscolar>["columns"] = columns.map(
    (col) => {
      if (!(col as any).editable) return col as any;
      return {
        ...col,
        onCell: (record: IUnidadeEscolar) => ({
          record,
          dataIndex: (col as any).dataIndex,
          title: col.title,
          control,
          editing: isEditing(record),
        }),
      } as any;
    }
  );

  const rowSelection: any = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <Flex gap="middle" vertical>
      <StyledTable<IUnidadeEscolar>
        {...rest}
        rowKey="uuid"
        style={{ margin: "1.5rem 0" }}
        components={{
          body: { cell: EditableCell },
        }}
        rowSelection={rowSelection}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Flex>
  );
};

export default AdicionarEscolaTable;
