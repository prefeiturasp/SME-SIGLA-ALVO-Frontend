import React, { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import type { LinhaHistoricoCandidatos } from "../tipos";
import {
  TabelaHistoricoStyled,
  TabelaHistoricoWrapper,
} from "./TabelaHistoricoCandidatos.styles";

export interface TabelaHistoricoCandidatosProps {
  data: LinhaHistoricoCandidatos[];
  loading?: boolean;
  /** Quando false, omite a coluna de descrição. Default: true. */
  mostrarDescricao?: boolean;
}

function juntarClasses(...classes: Array<string | undefined>): string | undefined {
  const resultado = classes.filter(Boolean).join(" ");
  return resultado || undefined;
}

function celulasGrupo(
  prefixo: "convocados" | "escolhas" | "naoEscolhas" | "reconvocacao",
  opcoes?: { bordaEsquerda?: boolean; bordaDireita?: boolean },
): ColumnsType<LinhaHistoricoCandidatos> {
  const classEsquerda = opcoes?.bordaEsquerda ? "borda-grupo-esquerda" : undefined;
  const classDireita = opcoes?.bordaDireita ? "borda-grupo-direita" : undefined;

  return [
    {
      title: "Total",
      key: `${prefixo}_total`,
      width: 80,
      align: "center",
      className: classEsquerda,
      onHeaderCell: () => ({ className: classEsquerda }),
      onCell: () => ({
        className: juntarClasses("celula-total", classEsquerda),
      }),
      render: (_, row) => row[prefixo].total,
    },
    {
      title: "Geral",
      key: `${prefixo}_geral`,
      width: 80,
      align: "center",
      render: (_, row) => row[prefixo].geral,
    },
    {
      title: "PcD",
      key: `${prefixo}_pcd`,
      width: 80,
      align: "center",
      render: (_, row) => row[prefixo].pcd,
    },
    {
      title: "NNA",
      key: `${prefixo}_nna`,
      width: 80,
      align: "center",
      className: classDireita,
      onHeaderCell: () => ({ className: classDireita }),
      onCell: () => ({ className: classDireita }),
      render: (_, row) => row[prefixo].nna,
    },
  ];
}

const TabelaHistoricoCandidatos: React.FC<TabelaHistoricoCandidatosProps> = ({
  data,
  loading = false,
  mostrarDescricao = true,
}) => {
  const columns: ColumnsType<LinhaHistoricoCandidatos> = useMemo(() => {
    const colunaDescricao: ColumnsType<LinhaHistoricoCandidatos>[number] = {
      title: "",
      key: "descricao_grupo",
      children: [
        {
          title: "",
          dataIndex: "descricao",
          key: "descricao",
          width: 180,
          align: "center",
          onCell: () => ({ className: "celula-convocacao" }),
        },
      ],
    };

    return [
      ...(mostrarDescricao ? [colunaDescricao] : []),
      {
        title: "Convocados",
        key: "quantidade_convocados",
        children: celulasGrupo("convocados"),
      },
      {
        title: "Escolhas",
        key: "quantidade_escolhas",
        onHeaderCell: () => ({ className: "header-escolhas" }),
        children: celulasGrupo("escolhas", {
          bordaEsquerda: true,
          bordaDireita: true,
        }),
      },
      {
        title: "Não Escolhas",
        key: "nao_escolhas",
        onHeaderCell: () => ({ className: "header-nao-escolhas" }),
        children: celulasGrupo("naoEscolhas", { bordaDireita: true }),
      },
      {
        title: "Reconvocação",
        key: "reconvocacao",
        children: celulasGrupo("reconvocacao"),
      },
    ];
  }, [mostrarDescricao]);

  return (
    <TabelaHistoricoWrapper>
      <TabelaHistoricoStyled
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="key"
        pagination={false}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
      />
    </TabelaHistoricoWrapper>
  );
};

export default TabelaHistoricoCandidatos;
