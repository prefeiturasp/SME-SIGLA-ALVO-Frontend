import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Flex, Button, Tooltip, InputNumber } from "antd";
import type { TableColumnsType } from "antd";
import type { IUnidadeEscolar } from "../../../../services/resources/convocacao/IConvocacao";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Controller, useForm } from "react-hook-form";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";


interface UnidadeEscolarTableProps extends TableProps<IUnidadeEscolar> {
  originData: IUnidadeEscolar[];
  loading?: boolean;
  setEditableData: React.Dispatch<React.SetStateAction<IUnidadeEscolar[]>>;
}

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
            <InputNumber {...field} min={0} controls={false} style={{ width: 80 }} />
          )}
        />
      ) : (
        children
      )}
    </td>
  );
};

const UnidadeEscolarTable: React.FC<UnidadeEscolarTableProps> = ({
  originData,
  loading,
  setEditableData,
  ...rest
}) => {
  const StyledTableAny: any = StyledTable;
  const [data, setData] = useState<IUnidadeEscolar[]>(originData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    originData.map((item) => item.uuid)
  );
  const [editingKey, setEditingKey] = useState<string>("");

  useEffect(() => {
    setData(originData);
    setSelectedRowKeys(originData.map((item) => item.uuid));
  }, [originData]);

  const { control, getValues } = useForm({
    defaultValues: originData.reduce((acc, item) => {
      acc[item.uuid] = {
        vagas_definitivas: item.vagas_definitivas,
        vagas_precarias: item.vagas_precarias,
      };
      return acc;
    }, {} as Record<string, Partial<IUnidadeEscolar>>),
  });

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
      setEditableData((prev) =>
        prev.map((prevItem) =>
          prevItem.uuid === key ? { ...prevItem, ...values } : prevItem
        )
      );
      setEditingKey("");
    }
  };

  const baseColumns: TableColumnsType<IUnidadeEscolar> = [
    { title: "Código EOL", dataIndex: "codigo_eol" },
    { title: "DRE", dataIndex: "dre" },
    { title: "Tipo de unidade", dataIndex: "tipo" },
    { title: "Unidade Escolar", dataIndex: "nome_oficial" },
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
                icon={<CheckOutlined style={{ color: "#05409A" }} />}
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
                icon={<ModeEditOutlineOutlinedIcon style={{ color: "#05409A" }} />}
              />
            </Tooltip>
            <Button type="link" style={{ visibility: "hidden" }} icon={<CloseOutlined />} />
          </div>
        );
      },
    },
  ];

  const columns: TableProps<IUnidadeEscolar>["columns"] = baseColumns.map((col) => {
    if (!(col as any).editable) return col;
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
  });

  const rowSelection: any = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <Flex gap="middle" vertical>
      <StyledTableAny
        {...rest}
        rowKey="uuid"
        style={{ margin: "1.5rem 0" }}
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        loading={loading}
        dataSource={data}
        columns={columns as any}
        rowSelection={rowSelection}
        rowClassName="editable-row"
        pagination={false}
      />
    </Flex>
  );
};

export default UnidadeEscolarTable;
