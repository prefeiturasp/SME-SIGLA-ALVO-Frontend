import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  Tooltip,
  TimePicker,
  message,
} from "antd";
import { CalendarOutlined, DownOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import type { PeriodoItem } from "../hooks/useAgenda";
import { commonStyles, inlineStyles, agendaTabelaStyles } from "../styles";

const { Text } = Typography;

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
            <Button
              className="agendar-btn"
              icon={<CalendarOutlined />}
              onClick={() => handleAgendarClick(record.uuid)}
            >
              Agendar
            </Button>
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
              handleRemoverPeriodo={handleRemoverPeriodo}
              editingKey={editingKey}
              isEditing={isEditing}
              edit={edit}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
              calcularIntervaloClassificacao={calcularIntervaloClassificacao}
              verificarConflitoTempoReal={verificarConflitoTempoReal}
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

// Componente da tabela expandida integrado
const AgendaTabelaExpandida: React.FC<{
  periodosList: PeriodoItem[];
  handleRemoverPeriodo: (id: number) => void;
  editingKey: number | null;
  isEditing: (record: PeriodoItem) => boolean;
  edit: (record: PeriodoItem) => void;
  cancelEdit: () => void;
  saveEdit: (key: number, periodoDataItem: PeriodoItem, values: any) => { success: boolean; message?: string };
  calcularIntervaloClassificacao: (periodo: PeriodoItem) => string;
  verificarConflitoTempoReal: (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined) => boolean;
}> = ({
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
      message.error(result.message || 'Erro ao salvar período.');
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
        return editing ? (
          <div style={agendaTabelaStyles.editContainer}>
            <Controller
              name={`${record.id}.classificacao`}
              control={control}
              defaultValue={record.classificacao || 1}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  style={agendaTabelaStyles.editInput}
                  placeholder="Quantidade"
                />
              )}
            />
            <Typography.Text style={agendaTabelaStyles.candidatosText}>
              candidatos
            </Typography.Text>
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
        return editing ? (
          <div style={agendaTabelaStyles.editContainer}>
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
                        style={agendaTabelaStyles.editTimePicker}
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
                <Typography.Text strong style={agendaTabelaStyles.timeSeparator}>às</Typography.Text>
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
                        style={agendaTabelaStyles.editTimePicker}
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
                    <Typography.Text type="danger" style={agendaTabelaStyles.conflictText}>
                      Horário já existe
                    </Typography.Text>
                  ) : null;
                })()}
              </>
            ) : (
              <Typography.Text style={agendaTabelaStyles.onlineText}>
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
          <div style={agendaTabelaStyles.actionsContainer}>
            <Tooltip title="Salvar">
              <Button
                type="link"
                onClick={() => salvarAgendaItemTabela(record.id, record)}
                icon={<CheckOutlined style={agendaTabelaStyles.saveIcon} />}
              />
            </Tooltip>
            <Tooltip title="Cancelar">
              <Button
                type="link"
                onClick={cancel}
                icon={<CloseOutlined style={agendaTabelaStyles.cancelIcon} />}
              />
            </Tooltip>
          </div>
        ) : (
          <div style={agendaTabelaStyles.actionsContainer}>
            <Tooltip title="Editar">
              <Button
                type="link"
                disabled={editingKey !== null}
                onClick={() => edit(record)}
                icon={<EditOutlined style={commonStyles.actionIcon} />}
              />
            </Tooltip>
            <Tooltip title="Excluir">
              <Button
                type="link"
                onClick={() => handleRemoverPeriodo(record.id)}
                icon={<DeleteOutlined style={commonStyles.deleteIcon} />}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Calcular total de candidatos
  const totalCandidatos = periodosList.reduce((sum, periodo) => sum + (periodo.classificacao || 0), 0);

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
            Total de {totalCandidatos} candidatos adicionados
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default AgendaTabela;
