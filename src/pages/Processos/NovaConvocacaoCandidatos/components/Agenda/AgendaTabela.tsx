import React from "react";
import { Table, Button, Tooltip, TimePicker, Typography, message } from "antd";
import { DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

interface PeriodoItem {
  id: number;
  cargo: string;
  classificacao: number; // Agora é um número inteiro
  dataEscolha: string;
  sessao: string;
  horario: string;
  horaInicio?: string;
  horaFim?: string;
  isRetardatario?: boolean;
  tipoEscolha?: string;
  numeroSessao?: number;
}

interface AgendaTabelaProps {
  periodosList: PeriodoItem[];
  handleRemoverPeriodo: (id: number) => void;
  onUpdatePeriodo?: (id: number, updates: Partial<PeriodoItem>) => void;
  editingKey: number | null;
  isEditing: (record: PeriodoItem) => boolean;
  edit: (record: PeriodoItem) => void;
  cancelEdit: () => void;
  saveEdit: (key: number, periodoDataItem: PeriodoItem, values: any) => { success: boolean; message?: string };
  calcularIntervaloClassificacao: (periodo: PeriodoItem) => string;
  verificarConflitoTempoReal: (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined) => boolean;
}

interface FormData {
  [key: string]: {
    horaInicio: string;
    horaFim: string;
    classificacao: number; // Agora é um número inteiro
  };
}

const AgendaTabela: React.FC<AgendaTabelaProps> = ({
  periodosList,
  handleRemoverPeriodo,
  editingKey,
  isEditing,
  edit,
  cancelEdit,
  saveEdit,
  calcularIntervaloClassificacao,
  verificarConflitoTempoReal,
}) => {
  

  const { control, getValues, reset } = useForm<FormData>({
    defaultValues: periodosList.reduce((acc, item) => {
      // Extrair hora início e fim do horário atual
      // const horarioMatch = item.horario.match(/(\d{2}:\d{2})\s*às\s*(\d{2}:\d{2})/);
      // const horaInicio = horarioMatch ? horarioMatch[1] : '';
      // const horaFim = horarioMatch ? horarioMatch[2] : '';
      
      acc[item.id.toString()] = {
        horaInicio: item.horaInicio || '',
        horaFim: item.horaFim || '',
        classificacao: item.classificacao || 1,
      };
      return acc;
    }, {} as FormData),
  });

  const cancel = () => {
    cancelEdit();
    reset();
  };


  const salvarAgendaItemTabela = (key: number, periodoDataItem: PeriodoItem) => {
    const values = getValues(key.toString());
    const result = saveEdit(key, periodoDataItem, values);
    
    if (!result.success) {
      message.error(result.message || 'Erro ao salvar período.');
    }
  };

  const columns = [
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Classificação',
      dataIndex: 'classificacao',
      key: 'classificacao',
      align: 'center' as const,
      editable: true,
      render: (_: number, record: PeriodoItem) => {
        const editing = isEditing(record);
        return editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <Controller
              name={`${record.id}.classificacao`}
              control={control}
              defaultValue={record.classificacao || 1}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  style={{ 
                    width: 80, 
                    textAlign: 'center',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    padding: '4px 8px'
                  }}
                  placeholder="Quantidade"
                />
              )}
            />
            <Typography.Text style={{ fontSize: '12px' }}>
              candidatos
            </Typography.Text>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {calcularIntervaloClassificacao(record)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ({record.classificacao} candidatos)
            </div>
          </div>
        );
      },
    },
    {
      title: 'Data da Escolha',
      dataIndex: 'dataEscolha',
      key: 'dataEscolha',
      align: 'center' as const,
    },
    {
      title: 'Sessão',
      dataIndex: 'sessao',
      key: 'sessao',
      align: 'center' as const,
    },
    {
      title: 'Horário',
      dataIndex: 'horario',
      key: 'horario',
      align: 'center' as const,
      editable: true,
      render: (text: string, record: PeriodoItem) => {
        const editing = isEditing(record);
        return editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            {record.tipoEscolha === "Presencial" ? (
              <>
                <Controller
                  name={`${record.id}.horaInicio`}
                  control={control}
                  defaultValue={record.horaInicio || ''}
                  render={({ field }) => {
                    const values = getValues(record.id.toString());
                    const temConflito = verificarConflitoTempoReal(record.id, values?.horaInicio || '', values?.horaFim || '');
                    return (
                      <TimePicker
                        {...field}
                        style={{ width: 80 }}
                        format="HH:mm"
                        placeholder="Início"
                        value={field.value ? dayjs(field.value, 'HH:mm') : null}
                        onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                        status={temConflito ? 'error' : undefined}
                        suffixIcon={null}
                      />
                    );
                  }}
                />
                <Typography.Text strong style={{ fontSize: '12px' }}>às</Typography.Text>
                <Controller
                  name={`${record.id}.horaFim`}
                  control={control}
                  defaultValue={record.horaFim || ''}
                  render={({ field }) => {
                    const values = getValues(record.id.toString());
                    const temConflito = verificarConflitoTempoReal(record.id, values?.horaInicio || '', values?.horaFim || '');
                    return (
                      <TimePicker
                        {...field}
                        style={{ width: 80 }}
                        format="HH:mm"
                        placeholder="Fim"
                        value={field.value ? dayjs(field.value, 'HH:mm') : null}
                        onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                        status={temConflito ? 'error' : undefined}
                        suffixIcon={null}
                      />
                    );
                  }}
                />
                {(() => {
                  const values = getValues(record.id.toString());
                  const temConflito = verificarConflitoTempoReal(record.id, values?.horaInicio || '', values?.horaFim || '');
                  return temConflito ? (
                    <Typography.Text type="danger" style={{ fontSize: '10px' }}>
                      Horário já existe
                    </Typography.Text>
                  ) : null;
                })()}
              </>
            ) : (
              <Typography.Text style={{ fontSize: '12px', color: '#666' }}>
                Online
              </Typography.Text>
            )}
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: PeriodoItem) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Tooltip title="Salvar">
              <Button
                type="link"
                onClick={() => salvarAgendaItemTabela(record.id, record)}
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
          <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Tooltip title="Editar">
              <Button
                type="link"
                disabled={editingKey !== null}
                onClick={() => edit(record)}
                icon={<ModeEditOutlineOutlinedIcon style={{ color: "#05409A" }} />}
              />
            </Tooltip>
            <Tooltip title="Excluir">
              <Button
                type="link"
                onClick={() => handleRemoverPeriodo(record.id)}
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (periodosList.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Table
        dataSource={periodosList}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={{
          backgroundColor: '#fff',
        }}
        rowClassName={(_: any, index: number) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        components={{
          body: {
            row: (props: any) => (
              <tr 
                {...props} 
                style={{
                  backgroundColor: props.className?.includes('table-row-dark') ? '#f5f5f5' : '#fff'
                }}
              />
            )
          }
        }}
      />
    </div>
  );
};

export default AgendaTabela;
