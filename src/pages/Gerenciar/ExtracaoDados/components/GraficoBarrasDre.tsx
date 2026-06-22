import React, { useMemo } from "react";
import { Bar } from "@ant-design/charts";
import { TextTitulo, TextTituloSecundario } from "../../../../components/EstilosCompartilhados";
import type { DreGraficoItem } from "../utils/mapGraficosDre";
import { formatValorComparativo, formatValorNumerico } from "../utils/formatValorIndicador";
import { ChartCard, ChartContainer } from "../styles";

type GraficoBarrasDreProps = {
  title: string;
  subtitle: string;
  data: DreGraficoItem[];
  tooltipLabel: string;
  barColor: string;
  modoComparativo?: boolean;
  anosComparativo?: string[];
  tooltipComparativoApenasAnos?: boolean;
};

const formatValorGrafico = (valor: number | null, modoComparativo: boolean) =>
  modoComparativo ? formatValorComparativo(valor) : formatValorNumerico(valor ?? 0);

const GraficoBarrasDre: React.FC<GraficoBarrasDreProps> = ({
  title,
  subtitle,
  data,
  tooltipLabel,
  barColor,
  modoComparativo = false,
  anosComparativo = [],
  tooltipComparativoApenasAnos = false,
}) => {
  const chartHeight = Math.max(320, data.length * 40 + 80);

  const config = useMemo(
    () => ({
      data,
      xField: "nome",
      yField: "valor",
      height: chartHeight,
      autoFit: true,
      marginLeft: 40,
      marginRight: 24,
      marginTop: 12,
      marginBottom: 40,
      inset: 20,
      color: barColor,
      style: {
        fill: barColor,
        maxWidth: 35,
        radiusTopRight: 4,
        radiusBottomRight: 4,
      },
      scale: {
        x: {
          paddingInner: 0.2,
          paddingOuter: 0.15,
        },
        y: { nice: true },
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
      tooltip: {
        title: false,
        items: [
          (datum: DreGraficoItem) => ({
            name: datum.nome,
            value: modoComparativo
              ? tooltipComparativoApenasAnos
                ? anosComparativo.join(" e ")
                : `Variação de ${tooltipLabel} entre ${anosComparativo.join(" e ")}: ${formatValorGrafico(datum.valor, true)}`
              : `${formatValorGrafico(datum.valor, false)} ${tooltipLabel}`,
            color: barColor,
          }),
        ],
      },
      interaction: {
        elementHighlight: true,
        tooltip: {
          marker: false,
          groupName: false,
        },
      },
    }),
    [data, chartHeight, tooltipLabel, barColor, modoComparativo, anosComparativo, tooltipComparativoApenasAnos]
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

export default GraficoBarrasDre;
