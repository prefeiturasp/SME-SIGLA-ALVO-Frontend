import React from "react";
import {
  IndicatorBreakdown,
  IndicatorCard,
  IndicatorDescription,
  IndicatorHeader,
  IndicatorIcon,
  IndicatorValue,
  IndicatorValueBox,
} from "../styles";
import { formatValorNumerico } from "../utils/formatValorIndicador";

export type IndicadorBreakdownItem = {
  label: string;
  value: number;
};

export type IndicadorCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number | null;
  description: string;
  breakdown?: IndicadorBreakdownItem[];
};

const IndicadorCard: React.FC<IndicadorCardProps> = ({
  icon,
  title,
  value,
  description,
  breakdown,
}) => {
  return (
    <IndicatorCard>
      <IndicatorHeader>
        <IndicatorIcon>{icon}</IndicatorIcon>
        {title}
      </IndicatorHeader>
      <IndicatorValueBox>
        <IndicatorValue>{formatValorNumerico(value ?? 0)}</IndicatorValue>
      </IndicatorValueBox>
      <IndicatorDescription>{description}</IndicatorDescription>
      {breakdown && breakdown.length > 0 && (
        <IndicatorBreakdown>
          {breakdown.map((item) => (
            <div key={item.label}>
              <span>{item.label}:</span>
              <div>{formatValorNumerico(item.value)}</div>
            </div>
          ))}
        </IndicatorBreakdown>
      )}
    </IndicatorCard>
  );
};

export default IndicadorCard;
