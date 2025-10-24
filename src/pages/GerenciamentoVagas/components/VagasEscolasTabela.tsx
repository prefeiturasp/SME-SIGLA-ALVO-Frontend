import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Flex, Button, Tooltip, InputNumber, Input } from "antd";
import type { TableColumnsType } from "antd";
import type { IVaga } from "../../../services/resources/convocacao/IConvocacao";
import { StyledTable } from "../../../components/EstilosCompartilhados";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Controller, useForm } from "react-hook-form";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";


interface VagasEscolasTabelaProps extends TableProps<IVaga> {
  filteredData: IVaga[];
  loading?: boolean;
  setEditableData: React.Dispatch<React.SetStateAction<IVaga[]>>;
  onSelectionChange?: (rows: IVaga[]) => void;
  onSelectionChangeKeys?: (keys: React.Key[]) => void;
  cargoUuid?: string | undefined;
}



const VagasEscolasTabela: React.FC<VagasEscolasTabelaProps> = ({
  filteredData,
  loading,
  setEditableData,
  onSelectionChange,
  onSelectionChangeKeys,
  cargoUuid,
  ...rest
}) => {
  const StyledTableAny: any = StyledTable;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [didInitSelection, setDidInitSelection] = useState<boolean>(false);

  // Seleção inicial apenas uma vez, não reexecuta ao desmarcar manualmente
  useEffect(() => {
    if (didInitSelection || !cargoUuid) return;

    // Regra 1: selecionar marcados pelo backend (esta_checada)
    const keysChecadas = filteredData
      .filter((item: any) => item?.esta_checada === true)
      .map((item) => item.uuid as React.Key);

    // Regra 2: caso todos estejam com foi_utilizada === false, selecionar todos
    const keysNaoUtilizados = filteredData
      .filter((item: any) => item?.foi_utilizada === false)
      .map((item) => item.uuid as React.Key);
    const todosEstaoNaoUtilizados = filteredData.length > 0 && keysNaoUtilizados.length === filteredData.length;
    const initialKeys = keysChecadas.length > 0 ? keysChecadas : (todosEstaoNaoUtilizados ? keysNaoUtilizados : []);
    if (initialKeys.length > 0) {
      setSelectedRowKeys(initialKeys);
      if (onSelectionChangeKeys) onSelectionChangeKeys(initialKeys);
      if (onSelectionChange) {
        const rows = filteredData.filter((item) => initialKeys.includes(item.uuid));
        onSelectionChange(rows);
      }
    }
    setDidInitSelection(true);
  }, [filteredData, didInitSelection, onSelectionChange, onSelectionChangeKeys, cargoUuid]);

  const { control, getValues, setValue } = useForm<Record<string, any>>({
    defaultValues: filteredData.reduce((acc, item) => {
      acc[item.uuid] = {
        vagas_definitivas: item.vagas_definitivas,
        vagas_precarias: item.vagas_precarias,
      };
      return acc;
    }, {} as Record<string, any>),
  });

  const isEditing = (record: IVaga) => record.uuid === editingKey;
  const edit = (record: IVaga) => {
    setValue(`${record.uuid}.vagas_definitivas_extra` as any, "");
    setValue(`${record.uuid}.vagas_precarias_extra` as any, "");
    setEditingKey(record.uuid);
  };
  const cancelFor = (record: IVaga) => {
    const definitivasExtra = getValues(`${record.uuid}.vagas_definitivas_extra` as any) as string | undefined;
    const precariasExtra = getValues(`${record.uuid}.vagas_precarias_extra` as any) as string | undefined;
    if (!definitivasExtra && !precariasExtra) {
      setValue(`${record.uuid}.vagas_definitivas_extra` as any, undefined as any);
      setValue(`${record.uuid}.vagas_precarias_extra` as any, undefined as any);
    }
    setEditingKey("");
  };
  const save = (key: React.Key) => {
    const values = getValues(`${key}`);
    const patch: any = {};
    if (values?.vagas_definitivas_extra !== undefined && values?.vagas_definitivas_extra !== "") {
      patch.vagas_definitivas_extra = values.vagas_definitivas_extra;
    }
    if (values?.vagas_precarias_extra !== undefined && values?.vagas_precarias_extra !== "") {
      patch.vagas_precarias_extra = values.vagas_precarias_extra;
    }
    if (Object.keys(patch).length > 0) {
      setEditableData((prev) => prev.map((row) => row.uuid === key ? { ...row, ...patch } as any : row));
    }
    const newData = [...filteredData];
    const index = newData.findIndex((item) => key === item.uuid);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...patch });
      setEditableData((prev) =>
        prev.map((prevItem) =>
          prevItem.uuid === key ? { ...prevItem, ...patch } : prevItem
        )
      );
      setEditingKey("");
    }
  };

  const baseColumns: TableColumnsType<IVaga> = [
    {
      title: "Código EOL",
      key: "codigo_eol",
      width: '7%',
      render: (_: any, record: IVaga) => record.escola?.codigo_eol,
    },
    {
      title: "DRE",
      key: "dre_nome",
      width: '38%',
      render: (_: any, record: IVaga) => record.escola?.dre?.nome,
    },
    {
      title: "Unidade Escolar",
      key: "nome_oficial",
      width: '30%',
      render: (_: any, record: IVaga) => record.escola?.nome_oficial,
    },
    {
      title: "Vagas definitivas",
      dataIndex: "vagas_definitivas",
      width: '10%',
      editable: true,
      render: (_: any, record: IVaga) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InputNumber value={(record as any).vagas_definitivas_utilizadas ?? record.vagas_definitivas} disabled controls={false} style={{ width: 60 }} />
          {isEditing(record)
            ? (
            <Controller
              name={`${record.uuid}.vagas_definitivas_extra`}
              control={control}
              render={({ field }) => (
                <Input {...field} style={{ width: 60, color: '#0A8F3A' }} />
              )}
            />
            )
            : ((record as any).vagas_definitivas_extra
                ? <Input value={(record as any).vagas_definitivas_extra} disabled style={{ width: 60, backgroundColor: '#fff', color: '#0A8F3A' }} />
                : null)
          }
        </div>
      ),
    } as any,
    {
      title: "Vagas precárias",
      dataIndex: "vagas_precarias",
      width: '10%',
      editable: true,
      render: (_: any, record: IVaga) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InputNumber value={(record as any).vagas_precarias_utilizadas ?? record.vagas_precarias} disabled controls={false} style={{ width: 60 }} />
          {isEditing(record)
            ? (
            <Controller
              name={`${record.uuid}.vagas_precarias_extra`}
              control={control}
              render={({ field }) => (
                <Input {...field} style={{ width: 60, color: '#0A8F3A' }} />
              )}
            />
            )
            : ((record as any).vagas_precarias_extra
                ? <Input value={(record as any).vagas_precarias_extra} disabled style={{ width: 60, backgroundColor: '#fff', color: '#0A8F3A' }} />
                : null)
          }
        </div>
      ),
    } as any,
    {
      title: "Editar",
      key: "editar",
      width: '5%',
      align: "center" as const,
      render: (_: any, record: IVaga) => {
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
                onClick={() => cancelFor(record)}
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
    onChange: (keys: React.Key[], rows: any[]) => {
      setSelectedRowKeys(keys);
      const visibleUuids = new Set(filteredData.map((item) => item.uuid));
      setEditableData((prev) =>
        prev.map((item) =>
          visibleUuids.has(item.uuid)
            ? { ...item, checked: keys.includes(item.uuid) }
            : item
        )
      );
      if (onSelectionChange) onSelectionChange(rows as IVaga[]);
      if (onSelectionChangeKeys) onSelectionChangeKeys(keys);
    },
  };

  const [paginationState, setPaginationState] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 });

  return (
    <Flex gap="middle" vertical>
      <StyledTableAny
        {...rest}
        rowKey="uuid"
        bordered
        loading={loading}
        dataSource={filteredData}
        columns={columns as any}
        rowSelection={rowSelection}
        rowClassName="editable-row"
        size="small"
        pagination={{ 
            pageSize: paginationState.pageSize, current: paginationState.current, onChange: (page: number, pageSize?: number) => setPaginationState({ current: page, pageSize: pageSize || 10 }),
            total: filteredData?.length,
            showTotal: (total: number, range: [number, number]) => (
                <span style={{ marginLeft: 16 }}>
                {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
                </span>
            ),
        }}
        // footer da tabela foi removido a pedido

      />
    </Flex>
  );
};

export default VagasEscolasTabela;


