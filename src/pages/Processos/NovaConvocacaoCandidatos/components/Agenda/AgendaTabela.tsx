import React from "react";
import { Table, TimePicker, Typography, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AppIconButton, DeleteActionIcon, EditActionIcon } from '@/components/ui';
import {
  editRowCentered,
  editNumberInput,
  mutedHelperText,
  actionsRowCenter,
  tableConfirmIcon,
  tableCancelIcon,
  brandHighlightText,
  formErrorTextInline,
} from "@/design-system/estilos";

const tableStyles = {
  container: { marginTop: 24 },
  table: { backgroundColor: "#fff" },
  editRow: editRowCentered,
  numberInput: editNumberInput,
  helperText: mutedHelperText,
  intervalTitle: { fontWeight: "bold" as const, marginBottom: 4 },
  intervalSubtitle: mutedHelperText,
  timePicker: { width: 80 },
  separatorText: mutedHelperText,
  conflictText: { fontSize: "10px" },
  onlineText: mutedHelperText,
  actionsRow: actionsRowCenter,
  saveIcon: tableConfirmIcon,
  cancelIcon: tableCancelIcon,
  rowBackground: (isDark: boolean) => ({
    backgroundColor: isDark ? "#f5f5f5" : "#fff",
  }),
};

const highlightText = brandHighlightText;
const errorMessageInline = formErrorTextInline;
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
          <div style={tableStyles.editRow}>
            <Controller
              name={`${record.id}.classificacao`}
              control={control}
              defaultValue={record.classificacao || 1}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  style={tableStyles.numberInput}
                  placeholder="Quantidade"
                />
              )}
            />
            <Typography.Text style={tableStyles.helperText}>
              candidatos
            </Typography.Text>
          </div>
        ) : (
          <div>
            <div style={tableStyles.intervalTitle}>
              {calcularIntervaloClassificacao(record)}
            </div>
            <div style={tableStyles.intervalSubtitle}>
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
          <div style={tableStyles.editRow}>
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
                        style={tableStyles.timePicker}
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
                <Typography.Text strong style={tableStyles.helperText}>às</Typography.Text>
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
                        style={tableStyles.timePicker}
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
                    <Typography.Text type="danger" style={tableStyles.conflictText}>
                      Horário já existe
                    </Typography.Text>
                  ) : null;
                })()}
              </>
            ) : (
              <Typography.Text style={tableStyles.intervalSubtitle}>
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
          <div style={tableStyles.actionsRow}>
            <AppIconButton
              type="link"
              tooltip="Salvar"
              onClick={() => salvarAgendaItemTabela(record.id, record)}
              icon={<CheckOutlined style={tableStyles.saveIcon} />}
            />
            <AppIconButton
              type="link"
              tooltip="Cancelar"
              onClick={cancel}
              icon={<CloseOutlined style={tableStyles.cancelIcon} />}
            />
          </div>
        ) : (
          <div style={tableStyles.actionsRow}>
            <AppIconButton
              type="link"
              tooltip="Editar"
              disabled={editingKey !== null}
              onClick={() => edit(record)}
              icon={<EditActionIcon />}
            />
            <AppIconButton
              type="link"
              tooltip="Excluir"
              onClick={() => handleRemoverPeriodo(record.id)}
              icon={<DeleteActionIcon />}
            />
          </div>
        );
      },
    },
  ];

  if (periodosList.length === 0) {
    return null;
  }

  return (
    <div style={tableStyles.container}>
      <Table
        dataSource={periodosList}
        columns={columns}
        rowKey="id"
        pagination={false}
        style={tableStyles.table}
        rowClassName={(_: any, index: number) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        components={{
          body: {
            row: (props: any) => (
              <tr 
                {...props} 
                style={tableStyles.rowBackground(props.className?.includes('table-row-dark'))}
              />
            )
          }
        }}
      />
    </div>
  );
};

export default AgendaTabela;
