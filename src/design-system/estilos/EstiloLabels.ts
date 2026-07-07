import styled from "styled-components";
import { tokens } from "../tokens";

const { label } = tokens.typography;

export const labelStyle = {
  fontFamily: tokens.fontFamily,
  fontWeight: label.fontWeight,
  fontSize: `${label.fontSize}px`,
  lineHeight: `${label.lineHeight * 100}%`,
  letterSpacing: `${label.letterSpacing}%`,
  color: tokens.colors.textPrimary,
} as const;

const formLabelCss = `
  color: ${tokens.colors.textPrimary};
  font-family: ${tokens.fontFamily};
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight};
  letter-spacing: ${label.letterSpacing};
`;

/** Tipografia padrão de labels de formulário */
export const FormLabelStyled = styled.span`
  ${formLabelCss}
`;

/** Alias usado em filtros e formulários */
export const FieldLabel = FormLabelStyled;

/** Label standalone acima de campo (filtros sem AppFormItem) */
export const BlockFormLabel = styled(FormLabelStyled)`
  display: block;
  margin-bottom: 0.75rem;
`;

/** @deprecated Use BlockFormLabel */
export const FilterLabel = BlockFormLabel;

/** Label de campo em modais */
export const ModalFieldLabel = BlockFormLabel;

/** Label de informação em modais */
export const ModalInfoLabel = FormLabelStyled;

/** Login: label com espaço para ícone de ajuda */
export const LoginFieldLabel = styled(FormLabelStyled)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

export const ProfileFieldLabel = BlockFormLabel;

export const MeusDadosFieldLabel = BlockFormLabel;
