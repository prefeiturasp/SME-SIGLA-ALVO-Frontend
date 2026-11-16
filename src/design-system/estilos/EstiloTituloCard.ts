import styled from "styled-components";
import Title from "antd/es/typography/Title";
import { Modal, Typography } from "antd";
import { tokens } from "../tokens";

const { cardTitle } = tokens.typography;
const { Text } = Typography;

export const cardTitleStyle = {
  fontFamily: tokens.fontFamily,
  fontWeight: cardTitle.fontWeight,
  fontSize: `${cardTitle.fontSize}px`,
  lineHeight: `${cardTitle.lineHeight * 100}%`,
  letterSpacing: `${cardTitle.letterSpacing}%`,
  color: tokens.colors.textPrimary,
} as const;

export const CardTitleStyled = styled(Title).attrs({ level: 4 })`
  && {
    margin: 0;
    color: ${tokens.colors.textPrimary} !important;
    font-family: ${tokens.fontFamily} !important;
    font-size: ${cardTitle.fontSize}px !important;
    font-weight: ${cardTitle.fontWeight} !important;
    line-height: ${cardTitle.lineHeight} !important;
    letter-spacing: ${cardTitle.letterSpacing} !important;
  }
`;

/** Espaçamento entre o título "Busca processos" e os campos de filtro abaixo */
export const buscaProcessosTitleSpacing = "1.25rem";

export const buscaProcessosTitleStyle = {
  margin: `0 0 ${buscaProcessosTitleSpacing} 0`,
} as const;

/** Título de seção de busca/filtros (ex.: "Busca processos") */
export const BuscaProcessosTitleStyled = styled(CardTitleStyled)`
  && {
    margin: 0 0 ${buscaProcessosTitleSpacing} 0 !important;
  }
`;


// legacyTypography

export const TextBlue = styled(Text)`
  color: #05409a;
  font-weight: 700;
`;

export const SectionTitle = styled(Title).attrs({ level: 5 })`
  margin-bottom: 1.5rem !important;
  color: #333 !important;
`;

export const TextSubHeading = styled(Text)`
  color: #515151;
  font-size: 18px;
  font-weight: 600;
`;

export const TextSubHeadingPreto = styled(Text)`
  color: rgb(19, 19, 19);
  font-size: 18px;
  font-weight: 600;
`;

export const TextTituloCinza = styled(Text)`
  color: rgba(81, 81, 81, 0.8);
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`;

export const TextTitulo = styled(Text)`
  color: rgb(0, 0, 0);
  font-size: 14px;
  font-weight: 800;
  line-height: 22px;
`;

export const TextTituloSecundario = styled(Text)`
  color: rgb(0, 0, 0);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`;

export const TextSubTituloCinza = styled(Text)`
  display: block;
  color: rgb(70, 70, 70);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`;

export const CustomTitle = styled(CardTitleStyled)`
  margin: 2.375rem 0 1rem 0;
`;

export const CustomModal = styled(Modal)`
  .ant-modal-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 1.4;
  }
`;

export const CustomModal2 = styled(Modal)`
  .ant-modal-content {
    padding: 2rem 2rem 1.5rem 2rem;
    border-radius: 2px;
  }

  .ant-modal-header {
    padding: 0;
  }

  .ant-modal-footer {
    padding: 1.5rem 0 0 0;

    .ant-btn-primary {
      border-radius: 2px;
    }
  }
`;
