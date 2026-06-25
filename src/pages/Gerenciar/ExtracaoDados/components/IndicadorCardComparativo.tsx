import React from "react";
import type {
  IExtracaoDadosIndicadorBreakdownComparativo,
  IExtracaoDadosIndicadorComparativoItem,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import { calcularVariacaoPercentual } from "../utils/calcularVariacaoPercentual";
import { formatValorNumerico, formatValorPercentual } from "../utils/formatValorIndicador";
import {
  IndicatorCard,
  IndicatorCompareBreakdown,
  IndicatorCompareBreakdownColumn,
  IndicatorCompareBreakdownLabel,
  IndicatorCompareBreakdownValue,
  IndicatorCompareRow,
  IndicatorCompareValue,
  IndicatorDescription,
  IndicatorHeader,
  IndicatorIcon,
  IndicatorVariationPill,
  IndicatorYearBox,
  IndicatorYearLabel,
} from "../styles";

export type IndicadorCardComparativoProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  anoAntigo: string;
  anoRecente: string;
  item: IExtracaoDadosIndicadorComparativoItem;
  breakdown?: IExtracaoDadosIndicadorBreakdownComparativo[];
  exibirVariacao?: boolean;
  modoValorUnico?: boolean;
};

const IndicadorCardComparativo: React.FC<IndicadorCardComparativoProps> = ({
  icon,
  title,
  description,
  anoAntigo,
  anoRecente,
  item,
  breakdown,
  exibirVariacao = true,
  modoValorUnico = false,
}) => {
  const variacao =
    item.variacaoPercentual ??
    calcularVariacaoPercentual(item.valorAnoAntigo, item.valorAnoRecente);
  const exibirPill = exibirVariacao;
  const valorUnico = item.valorUnico ?? item.valorAnoAntigo;

  return (
    <IndicatorCard>
      <IndicatorHeader>
        <IndicatorIcon>{icon}</IndicatorIcon>
        {title}
      </IndicatorHeader>

      {modoValorUnico ? (
        <IndicatorYearBox>
          {exibirPill && (
            <IndicatorVariationPill $positivo={variacao >= 0}>
              {formatValorPercentual(variacao)}
            </IndicatorVariationPill>
          )}
          <IndicatorCompareValue>{formatValorNumerico(valorUnico)}</IndicatorCompareValue>
        </IndicatorYearBox>
      ) : (
        <IndicatorCompareRow>
          <IndicatorYearBox>
            <IndicatorYearLabel>{anoAntigo}</IndicatorYearLabel>
            <IndicatorCompareValue>
              {formatValorNumerico(item.valorAnoAntigo)}
            </IndicatorCompareValue>
          </IndicatorYearBox>

          <IndicatorYearBox>
            {exibirPill && (
              <IndicatorVariationPill $positivo={variacao >= 0}>
                {formatValorPercentual(variacao)}
              </IndicatorVariationPill>
            )}
            <IndicatorYearLabel>{anoRecente}</IndicatorYearLabel>
            <IndicatorCompareValue>
              {formatValorNumerico(item.valorAnoRecente)}
            </IndicatorCompareValue>
          </IndicatorYearBox>
        </IndicatorCompareRow>
      )}

      {breakdown && breakdown.length > 0 ? (
        <>
          <IndicatorDescription>{description}</IndicatorDescription>
          <IndicatorCompareBreakdown>
            {breakdown.map((linha) => (
              <IndicatorCompareBreakdownColumn key={linha.label}>
                <IndicatorCompareBreakdownLabel>{linha.label}</IndicatorCompareBreakdownLabel>
                <IndicatorCompareBreakdownValue>
                  {formatValorNumerico(linha.valorAnoAntigo)} ({anoAntigo})
                </IndicatorCompareBreakdownValue>
                <IndicatorCompareBreakdownValue>
                  {formatValorNumerico(linha.valorAnoRecente)} ({anoRecente})
                </IndicatorCompareBreakdownValue>
              </IndicatorCompareBreakdownColumn>
            ))}
          </IndicatorCompareBreakdown>
        </>
      ) : (
        <IndicatorDescription>{description}</IndicatorDescription>
      )}
    </IndicatorCard>
  );
};

export default IndicadorCardComparativo;
