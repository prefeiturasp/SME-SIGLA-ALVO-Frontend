import React, { useState } from "react";
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
  onUpdatePeriodo,
}) => {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  
  // Função para calcular o intervalo de classificação para um período específico
  const calcularIntervaloClassificacao = (periodo: PeriodoItem): string => {
    if (periodo.isRetardatario) {
      return "-";
    }
    
    // Encontrar todos os períodos do mesmo cargo que vêm antes do período atual
    const periodosMesmoCargo = periodosList
      .filter(p => p.cargo === periodo.cargo)
      .sort((a, b) => {
        // Ordenar por data e depois por horário
        if (a.dataEscolha !== b.dataEscolha) {
          return a.dataEscolha.localeCompare(b.dataEscolha);
        }
        return a.horario.localeCompare(b.horario);
      });
    
    // Calcular a posição do período atual na lista ordenada
    const indiceAtual = periodosMesmoCargo.findIndex(p => p.id === periodo.id);

    // Somar as quantidades dos períodos anteriores
    let somaAnterior = 0;
    for (let i = 0; i < indiceAtual; i++) {
      somaAnterior += periodosMesmoCargo[i].classificacao || 0;
    }

    const inicio = somaAnterior + 1;
    const fim = somaAnterior + (periodo.classificacao || 0);
    console.log("inicio", inicio);
    console.log("fim", fim);
    console.log("indiceAtual", indiceAtual);
    console.log("somaAnterior", somaAnterior);
    if (inicio === fim) {
      return `${inicio}ª`;
    } else {
      return `${inicio}ª até ${fim}ª`;
    }
  };

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

  const isEditing = (record: PeriodoItem) => record.id === editingKey;

  const edit = (record: PeriodoItem) => {
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
    reset();
  };

  // Função para verificar se o horário já existe na mesma data
  const verificarHorarioExistente = (key: number, horaInicio: string, horaFim: string): boolean => {
    const periodoAtual = periodosList.find(p => p.id === key);
    if (!periodoAtual) return false;

    return periodosList.some(periodo => {
      // Não verificar contra o próprio período
      if (periodo.id === key) return false;
      
      // Verificar se é a mesma data
      if (periodo.dataEscolha !== periodoAtual.dataEscolha) return false;
      
      // Verificar se o horário já existe
      const horarioExistente = periodo.horario;
      if (horarioExistente === "Online") return false; // Online não tem conflito de horário
      
      // Extrair horário existente
      const matchExistente = horarioExistente.match(/(\d{2}:\d{2})\s*às\s*(\d{2}:\d{2})/);
      if (!matchExistente) return false;
      
      const [, inicioExistente, fimExistente] = matchExistente;
      
      // Verificar sobreposição de horários
      const inicio1 = horaInicio;
      const fim1 = horaFim;
      const inicio2 = inicioExistente;
      const fim2 = fimExistente;
      
      // Converte para minutos para facilitar comparação
      const toMinutes = (time: string | number | undefined) => {
        if (!time || typeof time !== 'string') return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const inicio1Min = toMinutes(inicio1);
      const fim1Min = toMinutes(fim1);
      const inicio2Min = toMinutes(inicio2);
      const fim2Min = toMinutes(fim2);
      
      // Verifica se há sobreposição: um horário começa antes do outro terminar
      return (inicio1Min < fim2Min && fim1Min > inicio2Min);
    });
  };

  // Função para verificar conflito de horário em tempo real
  const verificarConflitoTempoReal = (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined): boolean => {
    if (!horaInicio || !horaFim || typeof horaInicio !== 'string' || typeof horaFim !== 'string') return false;
    return verificarHorarioExistente(key, horaInicio, horaFim);
  };

  const save = (key: number, periodoDataItem: PeriodoItem) => {
    const values = getValues(key.toString());
    
    if (onUpdatePeriodo && values.classificacao) {
      // Se for tipo Presencial, verificar horários
      if (periodoDataItem?.tipoEscolha === "Presencial") {
        if (!values.horaInicio || !values.horaFim) {
          message.error('Horários são obrigatórios para tipo Presencial.');
          return;
        }
        
        // Verificar se o horário já existe na mesma data
        if (verificarHorarioExistente(key, values.horaInicio, values.horaFim)) {
          message.error('Este horário já existe na mesma data. Escolha outro horário.');
          return;
        }
      }
      console.log("values", values.classificacao);
      // Salvar os valores individuais sem formatação
      onUpdatePeriodo(key, { 
        horaInicio: values.horaInicio,
        horaFim: values.horaFim,
        classificacao: parseInt(values.classificacao)
      });
    }
    console.log("periodoList", periodosList);
    setEditingKey(null);
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
                onClick={() => save(record.id, record)}
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
