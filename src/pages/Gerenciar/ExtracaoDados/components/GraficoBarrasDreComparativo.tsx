import React, { useMemo } from "react";
import { Bar } from "@ant-design/charts";
import { TextTitulo, TextTituloSecundario } from "../../../../components/EstilosCompartilhados";
import type {
  DreComparativoResumo,
  DreGraficoComparativoItem,
} from "../utils/mapGraficosDre";
import { obterResumoComparativoPorTitulo } from "../utils/mapGraficosDre";
import { renderTooltipGraficoComparativo } from "../utils/renderTooltipGraficoComparativo";
import { ChartCard, ChartContainer } from "../styles";

export type LayoutBarrasComparativo = "agrupado" | "empilhado";

type GraficoBarrasDreComparativoProps = {
  title: string;
  subtitle: string;
  data: DreGraficoComparativoItem[];
  resumos: DreComparativoResumo[];
  tooltipLabel: string;
  corAnoAntigo?: string;
  corAnoRecente?: string;
  layoutBarras?: LayoutBarrasComparativo;
  exibirTituloDreNoTooltip?: boolean;
};

const ALTURA_BARRA_EMPILHADA = 12;
const ESPACAMENTO_ENTRE_BARRAS_EMPILHADAS = 1;
const INSET_BARRA_EMPILHADA = ESPACAMENTO_ENTRE_BARRAS_EMPILHADAS / 2;
const RAIO_BARRA_EMPILHADA = ALTURA_BARRA_EMPILHADA / 2;
const GROUP_PADDING_BARRAS_EMPILHADAS = 0;
const PADDING_INNER_EMPILHADO = 0.08;
const PADDING_OUTER_EMPILHADO = 0;
const ALTURA_LINHA_DRE_EMPILHADA =
  ALTURA_BARRA_EMPILHADA * 2 + ESPACAMENTO_ENTRE_BARRAS_EMPILHADAS;
const COMPRIMENTO_MINIMO_BARRA_EMPILHADA = 4;
const MARGEM_VERTICAL_GRAFICO_EMPILHADO = 68;

export const calcularAlturaGraficoEmpilhado = (dreCount: number) =>
  dreCount * ALTURA_LINHA_DRE_EMPILHADA + MARGEM_VERTICAL_GRAFICO_EMPILHADO;

const COR_ANO_ANTIGO_PADRAO = "#002C8C";
const COR_ANO_RECENTE_PADRAO = "#F5A623";

const GraficoBarrasDreComparativo: React.FC<GraficoBarrasDreComparativoProps> = ({
  title,
  subtitle,
  data,
  resumos,
  tooltipLabel,
  corAnoAntigo = COR_ANO_ANTIGO_PADRAO,
  corAnoRecente = COR_ANO_RECENTE_PADRAO,
  layoutBarras = "agrupado",
  exibirTituloDreNoTooltip,
}) => {
  const barrasEmpilhadas = layoutBarras === "empilhado";
  const deveExibirTituloDreNoTooltip = exibirTituloDreNoTooltip ?? !barrasEmpilhadas;
  const dreCount = resumos.length;
  const chartHeight = barrasEmpilhadas
    ? calcularAlturaGraficoEmpilhado(dreCount)
    : Math.max(320, dreCount * 56 + 80);

  const [anoAntigo, anoRecente] = useMemo(() => {
    if (!resumos.length) {
      return ["", ""];
    }

    return [resumos[0].anoAntigo, resumos[0].anoRecente];
  }, [resumos]);

  const montarTooltipComparativo = useMemo(
    () =>
      (titulo?: string) => {
        const resumo = obterResumoComparativoPorTitulo(resumos, titulo);
        if (!resumo) {
          return "";
        }

        const variacao =
          tooltipLabel === "escolhas"
            ? resumo.variacaoEscolhasPercentual
            : resumo.variacaoVagasPercentual;
        const valorAnoAntigo =
          tooltipLabel === "escolhas"
            ? resumo.escolhasAnoAntigo
            : resumo.vagasAnoAntigo;
        const valorAnoRecente =
          tooltipLabel === "escolhas"
            ? resumo.escolhasAnoRecente
            : resumo.vagasAnoRecente;

        return renderTooltipGraficoComparativo({
          dre: titulo,
          resumo,
          tooltipLabel,
          variacao,
          valorAnoAntigo,
          valorAnoRecente,
          corAnoAntigo,
          corAnoRecente,
          estiloPrototipo: barrasEmpilhadas,
          exibirTituloDre: deveExibirTituloDreNoTooltip,
        });
      },
    [
      resumos,
      tooltipLabel,
      corAnoAntigo,
      corAnoRecente,
      barrasEmpilhadas,
      deveExibirTituloDreNoTooltip,
    ]
  );

  const config = useMemo(
    () => ({
      data,
      xField: "dre",
      yField: "valor",
      seriesField: "ano",
      colorField: "ano",
      group: barrasEmpilhadas
        ? {
            padding: GROUP_PADDING_BARRAS_EMPILHADAS,
          }
        : true,
      height: chartHeight,
      autoFit: true,
      marginLeft: 40,
      marginRight: 24,
      marginTop: barrasEmpilhadas ? 8 : 12,
      marginBottom: barrasEmpilhadas ? 32 : 40,
      inset: barrasEmpilhadas ? 0 : 20,
      style: {
        maxWidth: barrasEmpilhadas ? ALTURA_BARRA_EMPILHADA : 28,
        minWidth: barrasEmpilhadas ? ALTURA_BARRA_EMPILHADA : undefined,
        insetTop: barrasEmpilhadas ? INSET_BARRA_EMPILHADA : undefined,
        insetBottom: barrasEmpilhadas ? INSET_BARRA_EMPILHADA : undefined,
        radiusTopRight: barrasEmpilhadas ? RAIO_BARRA_EMPILHADA : 4,
        radiusBottomRight: barrasEmpilhadas ? RAIO_BARRA_EMPILHADA : 4,
        radiusTopLeft: barrasEmpilhadas ? RAIO_BARRA_EMPILHADA : undefined,
        radiusBottomLeft: barrasEmpilhadas ? RAIO_BARRA_EMPILHADA : undefined,
        minHeight: barrasEmpilhadas ? COMPRIMENTO_MINIMO_BARRA_EMPILHADA : undefined,
      },
      scale: {
        x: {
          paddingInner: barrasEmpilhadas ? PADDING_INNER_EMPILHADO : 0.25,
          paddingOuter: barrasEmpilhadas ? PADDING_OUTER_EMPILHADO : 0.15,
        },
        y: { nice: true },
        color: {
          domain: [anoAntigo, anoRecente],
          range: [corAnoAntigo, corAnoRecente],
        },
      },
      axis: {
        x: {
          position: "left" as const,
          title: false,
          tick: false,
          line: false,
          labelFill: "#000000",
          labelFontSize: 12,
          labelFontWeight: 500,
          labelOpacity: 1,
          labelSpacing: 20,
          labelAlign: "horizontal" as const,
          labelTextAlign: "end" as const,
        },
        y: {
          position: "bottom" as const,
          title: false,
          grid: true,
          gridLineDash: [4, 4],
          labelFill: "#000000",
          labelFontSize: 12,
          labelOpacity: 1,
        },
      },
      legend: false,
      interaction: {
        elementHighlight: true,
        tooltip: {
          shared: true,
          marker: false,
          groupName: false,
          render: (
            _event: unknown,
            {
              title,
            }: {
              title?: string;
              items: Array<{ name?: string; value?: number | string }>;
            }
          ) => montarTooltipComparativo(title),
        },
      },
    }),
    [
      data,
      chartHeight,
      anoAntigo,
      anoRecente,
      corAnoAntigo,
      corAnoRecente,
      montarTooltipComparativo,
      barrasEmpilhadas,
    ]
  );

  return (
    <ChartCard>
      <TextTitulo style={{ fontSize: 20, marginLeft: 16, display: "block" }}>{title}</TextTitulo>
      <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, marginLeft: 16, display: "block" }}>
        {subtitle}
      </TextTituloSecundario>
      <ChartContainer>
        <Bar {...config} />
      </ChartContainer>
    </ChartCard>
  );
};

export default GraficoBarrasDreComparativo;
