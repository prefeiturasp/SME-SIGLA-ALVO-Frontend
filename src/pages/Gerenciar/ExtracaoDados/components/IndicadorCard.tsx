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

export type IndicadorBreakdownItem = {
  label: string;
  value: number;
};

export type IndicadorCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  breakdown?: IndicadorBreakdownItem[];
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const IndicadorCard: React.FC<IndicadorCardProps> = ({
  icon,
  title,
  value,
  description,
  breakdown,
}) => (
  <IndicatorCard>
    <IndicatorHeader>
      <IndicatorIcon>{icon}</IndicatorIcon>
      {title}
    </IndicatorHeader>
    <IndicatorValueBox>
      <IndicatorValue>{formatNumber(value)}</IndicatorValue>
    </IndicatorValueBox>
    <IndicatorDescription>{description}</IndicatorDescription>
    {breakdown && breakdown.length > 0 && (
      <IndicatorBreakdown>
        {breakdown.map((item) => (
          <div key={item.label}>
            <span>{item.label}:</span>
            <div>{formatNumber(item.value)}</div>
          </div>
        ))}
      </IndicatorBreakdown>
    )}
  </IndicatorCard>
);

export default IndicadorCard;
