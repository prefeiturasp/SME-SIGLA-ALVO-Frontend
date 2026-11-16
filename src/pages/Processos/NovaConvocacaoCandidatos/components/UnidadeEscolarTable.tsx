import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Flex, InputNumber } from "antd";
import type { TableColumnsType } from "antd";
import type { IVaga } from "../../../../services/resources/convocacao/IConvocacao";
import { Controller, useForm } from "react-hook-form";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";


import { StyledTable, EditActionIcon, editableTableStyles, AppIconButton } from '@/components/ui';
interface UnidadeEscolarTableProps extends TableProps<IVaga> {
  filteredData: IVaga[];
  loading?: boolean;
  setEditableData: React.Dispatch<React.SetStateAction<IVaga[]>>;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof IVaga;
  title: any;
  record: IVaga;
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
  filteredData,
  loading,
  setEditableData,
  ...rest
}) => {
  const StyledTableAny: any = StyledTable;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    filteredData.filter((item) => item.checked).map((item) => item.uuid)
  );
  const [editingKey, setEditingKey] = useState<string>("");

  useEffect(() => {
    setSelectedRowKeys(filteredData.filter((item) => item.checked).map((item) => item.uuid));
  }, [filteredData]);

  const { control, getValues } = useForm({
    defaultValues: filteredData.reduce((acc, item) => {
      acc[item.uuid] = {
        vagas_definitivas: item.vagas_definitivas,
        vagas_precarias: item.vagas_precarias,
      };
      return acc;
    }, {} as Record<string, Partial<IVaga>>),
  });

  const isEditing = (record: IVaga) => record.uuid === editingKey;
  const edit = (record: IVaga) => setEditingKey(record.uuid);
  const cancel = () => setEditingKey("");
  const save = (key: React.Key) => {
    const values = getValues(`${key}`);
    const newData = [...filteredData];
    const index = newData.findIndex((item) => key === item.uuid);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...values });
      setEditableData((prev) =>
        prev.map((prevItem) =>
          prevItem.uuid === key ? { ...prevItem, ...values } : prevItem
        )
      );
      setEditingKey("");
    }
  };

  const baseColumns: TableColumnsType<IVaga> = [
    {
      title: "Código EOL",
      key: "codigo_eol",
      render: (_: any, record: IVaga) => record.escola?.codigo_eol,
    },
    {
      title: "DRE",
      key: "dre_nome",
      render: (_: any, record: IVaga) => record.escola?.dre?.nome,
    },
    {
      title: "Unidade Escolar",
      key: "nome_oficial",
      render: (_: any, record: IVaga) => record.escola?.nome_oficial,
    },
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
      width: 85,
      align: "center" as const,
      render: (_: any, record: IVaga) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={editableTableStyles.actionsCell}>
            <AppIconButton
              type="link"
              tooltip="Salvar"
              onClick={() => save(record.uuid)}
              icon={<CheckOutlined style={editableTableStyles.saveIcon} />}
            />
            <AppIconButton
              type="link"
              tooltip="Cancelar"
              onClick={cancel}
              icon={<CloseOutlined style={editableTableStyles.cancelIcon} />}
            />
          </div>
        ) : (
          <div style={editableTableStyles.actionsCell}>
            <AppIconButton
              type="link"
              tooltip="Editar"
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              icon={<EditActionIcon />}
            />
            <AppIconButton type="link" style={editableTableStyles.hiddenPlaceholder} icon={<CloseOutlined />} />
          </div>
        );
      },
    },
  ];

  const columns: TableProps<IVaga>["columns"] = baseColumns.map((col) => {
    if (!(col as any).editable) return col;
    return {
      ...col,
      onCell: (record: IVaga) => ({
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
    preserveSelectedRowKeys: true,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
      const visibleUuids = new Set(filteredData.map((item) => item.uuid));
      setEditableData((prev) =>
        prev.map((item) =>
          visibleUuids.has(item.uuid)
            ? { ...item, checked: keys.includes(item.uuid) }
            : item
        )
      );
    },
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
        dataSource={filteredData}
        columns={columns as any}
        rowSelection={rowSelection}
        rowClassName="editable-row"
        pagination={false}
        scroll={{ x:0,y: 400 }} // ← scroll vertical

      />
    </Flex>
  );
};

export default UnidadeEscolarTable;
