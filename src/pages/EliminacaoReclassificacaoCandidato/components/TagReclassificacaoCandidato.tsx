import React from "react";
import type { TagReclassificacaoTipo } from "../utils/reclassificacao";

const TAG_STYLES: Record<
  TagReclassificacaoTipo,
  { backgroundColor: string; color: string; label: string }
> = {
  desclassificado: {
    backgroundColor: "#F5F5F5",
    color: "#434343",
    label: "Desclassificado",
  },
  reclassificado: {
    backgroundColor: "#EDEEFC",
    color: "#002C8C",
    label: "Reclassificado",
  },
};

type TagReclassificacaoCandidatoProps = {
  tipo: TagReclassificacaoTipo;
};

const TagReclassificacaoCandidato: React.FC<TagReclassificacaoCandidatoProps> = ({
  tipo,
}) => {
  const style = TAG_STYLES[tipo];

  return (
    <span
      style={{
        display: "inline-block",
        marginTop: 4,
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
};

export default TagReclassificacaoCandidato;
