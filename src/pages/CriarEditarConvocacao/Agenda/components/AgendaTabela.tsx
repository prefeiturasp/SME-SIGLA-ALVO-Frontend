import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  TimePicker,
  message,
} from "antd";
import { CalendarOutlined, DownOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AppButton, AppIconButton, DeleteActionIcon, EditActionIcon } from '@/components/ui';
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { MENSAGEM_LIMITE_REDISTRIBUICAO, type PeriodoItem } from "../hooks/useAgenda";
import { commonStyles, inlineStyles, agendaTabelaStyles } from "@/design-system/estilos";

const { Text } = Typography;

const INTERVALO_UMA_HORA_MSG = "Intervalo permitido: somente 1h.";

const isIntervaloUmaHora = (horaInicio?: string, horaFim?: string): boolean => {
  if (!horaInicio || !horaFim) return true;

  const inicio = dayjs(`2000-01-01 ${horaInicio}`);
  const fim = dayjs(`2000-01-01 ${horaFim}`);

  if (!inicio.isValid() || !fim.isValid()) return true;

  return fim.diff(inicio, "minute") === 60;
};

interface FormData {
  [key: string]: {
    horaInicio: string;
    horaFim: string;
    classificacao: number;
  };
}

interface AgendaTabelaProps {
  cargosAdicionados: any[];
  periodosList: PeriodoItem[];
  handleAgendarClick: (cargoUuid: string) => void;
  handleRemoverPeriodo: (id: number) => void;
  editingKey: number | null;
  isEditing: (record: PeriodoItem) => boolean;
  edit: (record: PeriodoItem) => void;
  cancelEdit: () => void;
  saveEdit: (key: number, periodoDataItem: PeriodoItem, values: any) => { success: boolean; message?: string };
  calcularIntervaloClassificacao: (periodo: PeriodoItem) => string;
  verificarConflitoTempoReal: (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined) => boolean;
  validarRedistribuicaoClassificacao: (
    key: number,
    periodoDataItem: PeriodoItem,
    novaClassificacao: number
  ) => { valid: boolean; message?: string };
  cargoParaExpandir: string | null;
  limparExpansao: () => void;
}

const AgendaTabela: React.FC<AgendaTabelaProps> = ({
  cargosAdicionados,
  periodosList,
  handleAgendarClick,
  handleRemoverPeriodo,
  editingKey,
  isEditing,
  edit,
  cancelEdit,
  saveEdit,
  calcularIntervaloClassificacao,
  verificarConflitoTempoReal,
  validarRedistribuicaoClassificacao,
  cargoParaExpandir,
  limparExpansao,
}) => {
  // Estado para controlar quais linhas estão expandidas
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // Effect para expansão automática quando cargoParaExpandir muda
  useEffect(() => {
    if (cargoParaExpandir) {
      // Encontrar o índice do cargo que deve ser expandido
      const cargoIndex = cargosAdicionados.findIndex(cargo => cargo.nome === cargoParaExpandir);
      if (cargoIndex !== -1) {
        // Expandir a linha correspondente
        setExpandedRowKeys([cargoIndex]);
        // Limpar o estado após expandir
        limparExpansao();
      }
    }
  }, [cargoParaExpandir, cargosAdicionados, limparExpansao]);

  if (cargosAdicionados.length === 0) {
    return (
      <div style={inlineStyles.placeholderMessage}>
        <Text>
          Nenhum cargo foi selecionado no step anterior. 
          Retorne ao step de seleção de cargos para adicionar cargos antes de agendar.
        </Text>
      </div>
    );
  }

  return (
    <Table
      dataSource={cargosAdicionados.map((cargo, index) => ({
        key: index,
        cargo: cargo.nome,
        quantidadeVagas: cargo.vagas,
        autorizacoes: 0,
        candidatos: cargo.totalCandidatos,
        uuid: cargo.uuid,
        cargoData: cargo,
        // Adicionar períodos relacionados a este cargo, ordenados por número da sessão
        periodos: periodosList
          .filter(p => p.cargo === cargo.nome)
          .sort((a, b) => {
            // Ordenar por número da sessão (retardatário por último)
            if (a.isRetardatario && !b.isRetardatario) return 1;
            if (!a.isRetardatario && b.isRetardatario) return -1;
            if (a.isRetardatario && b.isRetardatario) return 0;
            return (a.numeroSessao || 0) - (b.numeroSessao || 0);
          }),
      }))}
      columns={[
        {
          title: <span style={commonStyles.tableHeader}>Cargo</span>,
          dataIndex: 'cargo',
          key: 'cargo',
          align: 'center' as const,
        },
        {
          title: <span style={commonStyles.tableHeader}>Vagas</span>,
          dataIndex: 'quantidadeVagas',
          key: 'quantidadeVagas',
          align: 'center' as const,
          sorter: (a: any, b: any) => a.quantidadeVagas - b.quantidadeVagas,
        },
        {
          title: <span style={commonStyles.tableHeader}>Autorizações</span>,
          dataIndex: 'autorizacoes',
          key: 'autorizacoes',
          align: 'center' as const,
          sorter: (a: any, b: any) => a.autorizacoes - b.autorizacoes,
        },
        {
          title: <span style={commonStyles.tableHeader}>Candidatos</span>,
          dataIndex: 'candidatos',
          key: 'candidatos',
          align: 'center' as const,
          sorter: (a: any, b: any) => a.candidatos - b.candidatos,
        },
        {
          title: <span style={commonStyles.tableHeader}>Agendar</span>,
          key: 'agendar',
          width: 120,
          align: 'center' as const,
          render: (_: any, record: any) => (
            <AppButton
              className="agendar-btn"
              icon={<CalendarOutlined />}
              onClick={() => handleAgendarClick(record.uuid)}
            >
              Agendar
            </AppButton>
          ),
        },
        {
          title: <span style={commonStyles.tableHeader}>Expandir</span>,
          key: 'expandir',
          width: 120,
          align: 'center' as const,
          render: (_: any, record: any) => {
            const isExpanded = expandedRowKeys.includes(record.key);
            
            return (
              <DownOutlined 
                style={agendaTabelaStyles.expandIcon(isExpanded)}
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle da linha expandida
                  if (isExpanded) {
                    setExpandedRowKeys(prev => prev.filter(key => key !== record.key));
                  } else {
                    setExpandedRowKeys(prev => [...prev, record.key]);
                  }
                }}
              />
            );
          },
        },
      ]}
      expandable={{
        expandedRowRender: (record: any) => {
          const periodosDoCargo = record.periodos || [];
          const formResetKey = editingKey === null
            ? periodosDoCargo
                .map((periodo: PeriodoItem) =>
                  [
                    periodo.id,
                    periodo.horaInicio ?? '',
                    periodo.horaFim ?? '',
                    periodo.classificacao ?? '',
                  ].join('-')
                )
                .join('|')
            : 'editing';
          
          return (
            <AgendaTabelaExpandida
              key={formResetKey}
              periodosList={periodosDoCargo}
              totalCandidatosCargo={record.cargoData?.totalCandidatos ?? 0}
              handleRemoverPeriodo={handleRemoverPeriodo}
              editingKey={editingKey}
              isEditing={isEditing}
              edit={edit}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
              calcularIntervaloClassificacao={calcularIntervaloClassificacao}
              verificarConflitoTempoReal={verificarConflitoTempoReal}
              validarRedistribuicaoClassificacao={validarRedistribuicaoClassificacao}
            />
          );
        },
        expandedRowKeys: expandedRowKeys,
        onExpandedRowsChange: (keys: readonly React.Key[]) => {
          setExpandedRowKeys([...keys]);
        },
        expandRowByClick: false,
        showExpandColumn: false, // Esconder o ícone padrão do Ant Design
      }}
      pagination={false}
      size="middle"
      bordered
      rowClassName={(_, index?: number) =>
        (index || 0) % 2 === 0 ? "row-white" : "row-gray"
      }
      components={{
        header: {
          cell: (props: any) => (
            <th {...props} style={{ 
              ...props.style, 
              ...inlineStyles.tableHeaderCell
            }} />
          ),
        },
      }}
    />
  );
};

const getMaxClassificacaoSessao = (
  totalCandidatosCargo: number,
  periodosList: PeriodoItem[],
  record: PeriodoItem
): number | undefined => {
  const MAX_CANDIDATOS_POR_AGENDA = 30;
  if (record.isRetardatario || record.tipoEscolha !== "PRESENCIAL") {
    return undefined;
  }

  const numeroSessoes = periodosList.filter(
    (periodo) => !periodo.isRetardatario && periodo.tipoEscolha === "PRESENCIAL"
  ).length;

  if (numeroSessoes <= 0 || totalCandidatosCargo <= 0) {
    return undefined;
  }

  return Math.min(
    MAX_CANDIDATOS_POR_AGENDA,
    Math.max(1, totalCandidatosCargo - (numeroSessoes - 1))
  );
};

// Componente da tabela expandida integrado
const AgendaTabelaExpandida: React.FC<{
  periodosList: PeriodoItem[];
  totalCandidatosCargo: number;
  handleRemoverPeriodo: (id: number) => void;
  editingKey: number | null;
  isEditing: (record: PeriodoItem) => boolean;
  edit: (record: PeriodoItem) => void;
  cancelEdit: () => void;
  saveEdit: (key: number, periodoDataItem: PeriodoItem, values: any) => { success: boolean; message?: string };
  calcularIntervaloClassificacao: (periodo: PeriodoItem) => string;
  verificarConflitoTempoReal: (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined) => boolean;
  validarRedistribuicaoClassificacao: (
    key: number,
    periodoDataItem: PeriodoItem,
    novaClassificacao: number
  ) => { valid: boolean; message?: string };
}> = ({
  periodosList,
  totalCandidatosCargo,
  handleRemoverPeriodo,
  editingKey,
  isEditing,
  edit,
  cancelEdit,
  saveEdit,
  calcularIntervaloClassificacao,
  verificarConflitoTempoReal,
  validarRedistribuicaoClassificacao,
}) => {
  const { control, getValues, reset, watch } = useForm<FormData>({
    defaultValues: periodosList.reduce((acc, item) => {
      acc[item.id.toString()] = {
        horaInicio: item.horaInicio || '',
        horaFim: item.horaFim || '',
        classificacao: item.classificacao || 1,
      };
      return acc;
    }, {} as FormData),
  });

  const formValues = watch();

  const cancel = () => {
    cancelEdit();
    reset();
  };

  const salvarAgendaItemTabela = (key: number, periodoDataItem: PeriodoItem) => {
    // Obter valores do formulário usando os caminhos completos
    const formKey = key.toString();
    const horaInicio = getValues(`${formKey}.horaInicio` as any);
    const horaFim = getValues(`${formKey}.horaFim` as any);
    const classificacao = getValues(`${formKey}.classificacao` as any);
    
    // Montar objeto com os valores obtidos
    const values = {
      horaInicio: horaInicio || periodoDataItem.horaInicio || '',
      horaFim: horaFim || periodoDataItem.horaFim || '',
      classificacao: classificacao || periodoDataItem.classificacao || 1,
    };
    
    const result = saveEdit(key, periodoDataItem, values);

    if (!result.success) {
      const errosInline =
        result.message === INTERVALO_UMA_HORA_MSG ||
        result.message === 'Este horário já existe na mesma data. Escolha outro horário.' ||
        result.message === MENSAGEM_LIMITE_REDISTRIBUICAO ||
        result.message === "Valor inválido para redistribuição. Não há candidatos suficientes nas agendas seguintes.";

      if (!errosInline) {
        message.error(result.message || 'Erro ao salvar período.');
      }
    }
  };

  const columns = [
    {
      title: 'Qtd. Candidatos',
      dataIndex: 'classificacao',
      key: 'qtdCandidatos',
      align: 'center' as const,
      width: '120px',
      editable: true,
      render: (_: number, record: PeriodoItem) => {
        const editing = isEditing(record);
        const maxClassificacao = getMaxClassificacaoSessao(totalCandidatosCargo, periodosList, record);
        const classificacaoAtual = Number(
          formValues[record.id.toString()]?.classificacao ?? record.classificacao ?? 1
        );
        const validacaoRedistribuicao = editing
          ? validarRedistribuicaoClassificacao(record.id, record, classificacaoAtual)
          : { valid: true };
        const temErroClassificacao = !validacaoRedistribuicao.valid;

        return editing ? (
          <div style={agendaTabelaStyles.editHorarioContainer}>
            <div style={agendaTabelaStyles.editContainer}>
              <Controller
                name={`${record.id}.classificacao`}
                control={control}
                defaultValue={record.classificacao || 1}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={1}
                    max={maxClassificacao}
                    style={{
                      ...agendaTabelaStyles.editInput,
                      ...(temErroClassificacao ? { borderColor: '#ff4d4f' } : {}),
                    }}
                    onChange={(event) => {
                      const parsed = Number(event.target.value);
                      if (!Number.isFinite(parsed)) {
                        field.onChange(event.target.value);
                        return;
                      }

                      const valorLimitado = maxClassificacao
                        ? Math.min(Math.max(parsed, 1), maxClassificacao)
                        : Math.max(parsed, 1);

                      field.onChange(valorLimitado);
                    }}
                  />
                )}
              />
            </div>
            {temErroClassificacao && validacaoRedistribuicao.message && (
              <div style={agendaTabelaStyles.timeErrorContainer}>
                <Typography.Text type="danger" style={agendaTabelaStyles.conflictText}>
                  {validacaoRedistribuicao.message}
                </Typography.Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            {record.isRetardatario ? record.classificacao : record.classificacao}
          </div>
        );
      },
    },
    {
      title: 'Classificação',
      dataIndex: 'classificacao',
      key: 'classificacao',
      align: 'center' as const,
      width: '150px',
      editable: false,
      render: (_: number, record: PeriodoItem) => {
        return (
          <div>
            {calcularIntervaloClassificacao(record)}
          </div>
        );
      },
    },
    {
      title: 'Data da Escolha',
      dataIndex: 'dataEscolha',
      key: 'dataEscolha',
      align: 'center' as const,
      width: 50,
    },
    {
      title: 'Sessão',
      dataIndex: 'sessao',
      key: 'sessao',
      align: 'center' as const,
      width: 50,
    },
    {
      title: 'Horário',
      dataIndex: 'horario',
      key: 'horario',
      align: 'center' as const,
      width: 50,
      editable: true,
      render: (text: string, record: PeriodoItem) => {
        const editing = isEditing(record);
        const horarioValues = formValues[record.id.toString()];
        const horaInicio = horarioValues?.horaInicio || '';
        const horaFim = horarioValues?.horaFim || '';
        const temConflito = verificarConflitoTempoReal(record.id, horaInicio, horaFim);
        const intervaloInvalido = Boolean(horaInicio && horaFim && !isIntervaloUmaHora(horaInicio, horaFim));
        const temErroHorario = temConflito || intervaloInvalido;

        return editing ? (
          <div style={agendaTabelaStyles.editHorarioContainer}>
            {record.tipoEscolha === "PRESENCIAL" ? (
              <>
                <div style={agendaTabelaStyles.editContainer}>
                  <Controller
                    name={`${record.id}.horaInicio`}
                    control={control}
                    defaultValue={record.horaInicio || ''}
                    render={({ field }) => (
                      <TimePicker
                        {...field}
                        style={agendaTabelaStyles.editTimePicker}
                        format="HH:mm"
                        placeholder="Início"
                        value={field.value ? dayjs(field.value, 'HH:mm') : null}
                        onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                        status={temErroHorario ? 'error' : undefined}
                        suffixIcon={null}
                      />
                    )}
                  />
                  <Typography.Text strong style={agendaTabelaStyles.timeSeparator}>às</Typography.Text>
                  <Controller
                    name={`${record.id}.horaFim`}
                    control={control}
                    defaultValue={record.horaFim || ''}
                    render={({ field }) => (
                      <TimePicker
                        {...field}
                        style={agendaTabelaStyles.editTimePicker}
                        format="HH:mm"
                        placeholder="Fim"
                        value={field.value ? dayjs(field.value, 'HH:mm') : null}
                        onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                        status={temErroHorario ? 'error' : undefined}
                        suffixIcon={null}
                      />
                    )}
                  />
                </div>
                {(intervaloInvalido || temConflito) && (
                  <div style={agendaTabelaStyles.timeErrorContainer}>
                    {intervaloInvalido && (
                      <Typography.Text type="danger" style={agendaTabelaStyles.conflictText}>
                        {INTERVALO_UMA_HORA_MSG}
                      </Typography.Text>
                    )}
                    {temConflito && (
                      <Typography.Text type="danger" style={agendaTabelaStyles.conflictText}>
                        Horário já existe
                      </Typography.Text>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Typography.Text style={agendaTabelaStyles.onlineText}>
                -
              </Typography.Text>
            )}
          </div>
        ) : (
          record.tipoEscolha === "PRESENCIAL"
            ? `${record.horaInicio ?? "--"} às ${record.horaFim ?? "--"}`
            : "-"
        );
      },
    },
    {
      title: 'Modalidade',
      dataIndex: 'modalidade',
      key: 'modalidade',
      align: 'center' as const,
      width: 50,
      render: (_: any, record: PeriodoItem) => {
        const val = record.modalidade || (record.tipoEscolha as any);
        if (val === 'PRESENCIAL' || val === 'Presencial') return 'Presencial';
        if (val === 'ONLINE' || val === 'Online') return 'Online';
        return val || '—';
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
          <div style={agendaTabelaStyles.actionsContainer}>
            <AppIconButton
              type="link"
              tooltip="Salvar"
              onClick={() => salvarAgendaItemTabela(record.id, record)}
              icon={<CheckOutlined style={agendaTabelaStyles.saveIcon} />}
            />
            <AppIconButton
              type="link"
              tooltip="Cancelar"
              onClick={cancel}
              icon={<CloseOutlined style={agendaTabelaStyles.cancelIcon} />}
            />
          </div>
        ) : (
          <div style={agendaTabelaStyles.actionsContainer}>
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

  // Calcular total de candidatos
  const totalCandidatos = periodosList.reduce((sum, periodo) => {
    if (periodo?.isRetardatario) {
      return sum;
    }
    const valor = typeof periodo?.classificacao === "number" ? periodo.classificacao : 0;
    return sum + valor;
  }, 0);
  // Se a primeira agenda for ONLINE, exibir a quantidade de candidatos da primeira agenda
  const firstIsOnline = String(periodosList?.[0]?.tipoEscolha || "").toUpperCase() === "ONLINE";
  const onlineFirstCount =
    firstIsOnline && typeof periodosList?.[0]?.classificacao === "number"
      ? (periodosList[0].classificacao as number)
      : 0;
  const totalParaExibir = firstIsOnline ? onlineFirstCount : totalCandidatos;

  if (periodosList.length === 0) {
    return (
      <div style={agendaTabelaStyles.emptyMessage}>
        Nenhuma agenda adicionada para este cargo.
      </div>
    );
  }

  return (
    <div style={agendaTabelaStyles.expandedTableContainer}>
      <div style={agendaTabelaStyles.expandedTableWrapper}>
        <div style={agendaTabelaStyles.expandedTableTitle}>
          <Typography.Text strong style={agendaTabelaStyles.expandedTableTitleText}>
            Agendamentos
          </Typography.Text>
        </div>
        <Table
          dataSource={periodosList}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          style={agendaTabelaStyles.expandedTable}
          rowClassName={(_: any, index: number) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          components={{
            header: {
              cell: (props: any) => (
                <th 
                  {...props} 
                  style={agendaTabelaStyles.expandedTableHeader}
                />
              )
            },
            body: {
              row: (props: any) => (
                <tr 
                  {...props} 
                  style={agendaTabelaStyles.expandedTableRow(props.className?.includes('table-row-dark'))}
                />
              ),
              cell: (props: any) => (
                <td 
                  {...props} 
                  style={agendaTabelaStyles.expandedTableCell}
                />
              )
            }
          }}
        />
        
        {/* Contador de total de candidatos */}
        <div style={agendaTabelaStyles.candidatosCounter}>
          <Typography.Text style={agendaTabelaStyles.candidatosCounterText}>
            Total de {totalParaExibir} candidatos adicionados
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default AgendaTabela;
