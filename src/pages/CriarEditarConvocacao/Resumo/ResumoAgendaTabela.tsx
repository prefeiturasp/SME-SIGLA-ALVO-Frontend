import React, { useMemo } from "react";
import { Table } from "antd";
import dayjs from "dayjs";
import type { IAgenda } from "../../../services/resources/agenda/IAgenda";
import { ResumoTableStyles, resumoAgendaTabelaStyles } from "./styles";

interface ResumoAgendaTabelaProps {
  agendas: IAgenda[];
  loading?: boolean;
}

type AgendaItem = {
  id: string;
  classificacao: number;
  intervaloClassificacao: string;
  dataEscolha: string;
  sessao: string;
  horario: string;
};

const ResumoAgendaTabela: React.FC<ResumoAgendaTabelaProps> = ({
  agendas,
  loading = false,
}) => {
  // Função para calcular intervalo de classificação
  const calcularIntervaloClassificacao = (
    agenda: IAgenda,
    todasAgendas: IAgenda[]
  ): string => {
    if (agenda.retardatario) {
      return "-";
    }

    // Filtrar agendas do mesmo cargo e ordenar por data e horário
    const agendasMesmoCargo = todasAgendas
      .filter((a) => a.cargo_uuid === agenda.cargo_uuid)
      .sort((a, b) => {
        // Ordenar por data
        const dataA = a.escolha_em || a.data_escolha;
        const dataB = b.escolha_em || b.data_escolha;
        if (dataA !== dataB) {
          return dayjs(dataA).diff(dayjs(dataB), "day");
        }

        // Se as datas forem iguais, ordena por horário
        const horaA = a.hora_convocacao_inicio;
        const horaB = b.hora_convocacao_inicio;
        if (horaA && horaB) {
          return dayjs(`2000-01-01 ${horaA}`).diff(
            dayjs(`2000-01-01 ${horaB}`),
            "minute"
          );
        }

        return 0;
      });

    // Encontrar o índice da agenda atual
    const indiceAtual = agendasMesmoCargo.findIndex(
      (a) => a.uuid === agenda.uuid
    );

    // Somar as quantidades dos períodos anteriores
    let somaAnterior = 0;
    for (let i = 0; i < indiceAtual; i++) {
      somaAnterior += agendasMesmoCargo[i].classificacao || 0;
    }

    const inicio = somaAnterior + 1;
    const fim = somaAnterior + (agenda.classificacao || 0);

    if (inicio === fim) {
      return `${inicio}ª`;
    } else {
      return `${inicio}ª até ${fim}ª`;
    }
  };

  // Transformar agendas em itens para a tabela
  const agendaItems: AgendaItem[] = useMemo(() => {
    return agendas.map((agenda) => {
      // Formatar data de escolha
      let dataEscolhaFormatada: string;
      if (agenda.escolha_em) {
        dataEscolhaFormatada = dayjs(agenda.escolha_em).format("DD/MM/YYYY");
      } else {
        dataEscolhaFormatada = dayjs(agenda.data_escolha).format("DD/MM/YYYY");
      }

      // Formatar horário
      let horario: string;
      if (
        agenda.modalidade === "Presencial" &&
        agenda.hora_convocacao_inicio &&
        agenda.hora_convocacao_fim
      ) {
        const horaInicio = dayjs(
          `2000-01-01 ${agenda.hora_convocacao_inicio}`
        ).format("HH:mm");
        const horaFim = dayjs(
          `2000-01-01 ${agenda.hora_convocacao_fim}`
        ).format("HH:mm");
        horario = `${horaInicio} às ${horaFim}`;
      } else {
        horario = agenda.modalidade === "Online" ? "Online" : "—";
      }

      return {
        id: agenda.uuid,
        classificacao: agenda.classificacao || 0,
        intervaloClassificacao: calcularIntervaloClassificacao(agenda, agendas),
        dataEscolha: dataEscolhaFormatada,
        sessao: agenda.sessao || "—",
        horario: horario,
      };
    });
  }, [agendas]);

  const columns = [
    {
      title: "Qtd. Candidatos",
      dataIndex: "classificacao",
      key: "qtdCandidatos",
      align: "center" as const,
      width: "120px",
      render: (_: number, record: AgendaItem) => {
        return <div>{record.classificacao || 0}</div>;
      },
    },
    {
      title: "Classificação",
      dataIndex: "intervaloClassificacao",
      key: "classificacao",
      align: "center" as const,
      width: "150px",
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Data da Escolha",
      dataIndex: "dataEscolha",
      key: "dataEscolha",
      align: "center" as const,
      width: 50,
    },
    {
      title: "Sessão",
      dataIndex: "sessao",
      key: "sessao",
      align: "center" as const,
      width: 50,
    },
    {
      title: "Horário",
      dataIndex: "horario",
      key: "horario",
      align: "center" as const,
      width: 50,
    },
  ];

  if (agendaItems.length === 0) {
    return (
      <div style={resumoAgendaTabelaStyles.emptyMessage}>
        Nenhuma agenda adicionada para este cargo.
      </div>
    );
  }

  return (
    <>
      <ResumoTableStyles />
      <div 
        className="resumo-agenda-table"
        style={resumoAgendaTabelaStyles.tableContainer}
      >
        <Table
          dataSource={agendaItems}
          columns={columns}
          rowKey="id"
          pagination={false}
          loading={loading}
          size="small"
          style={resumoAgendaTabelaStyles.table}
          rowClassName={(_: any, index: number) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          components={{
            header: {
              cell: (props: any) => (
                <th 
                  {...props} 
                  style={resumoAgendaTabelaStyles.tableHeader} 
                />
              ),
            },
            body: {
              row: (props: any) => (
                <tr
                  {...props}
                  style={agendaTabelaStyles.expandedTableRow(
                    props.className?.includes("table-row-dark")
                  )}
                />
              ),
              cell: (props: any) => (
                <td {...props} style={agendaTabelaStyles.expandedTableCell} />
              ),
            },
          }}
        />
      </div>
    </>
  );
};

export default ResumoAgendaTabela;

