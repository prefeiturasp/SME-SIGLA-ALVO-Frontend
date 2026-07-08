import styled from "styled-components";
import { Button, Card } from "antd";
import { tokens } from "../tokens";


const { colors, controlHeight, borderRadius, fontFamily } = tokens;

export const buttonHeight = controlHeight;

/** Tipografia do label dos botões primary e secondary */
export const buttonLabelStyle = {
  fontFamily: "Open Sans, sans-serif",
  fontWeight: 700,
  fontStyle: "normal" as const,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
} as const;

const buttonLabelCss = `
  font-family: ${buttonLabelStyle.fontFamily};
  font-weight: ${buttonLabelStyle.fontWeight};
  font-style: ${buttonLabelStyle.fontStyle};
  font-size: ${buttonLabelStyle.fontSize};
  line-height: ${buttonLabelStyle.lineHeight};
  letter-spacing: ${buttonLabelStyle.letterSpacing};
`;

/** Tipografia do label dos botões tertiary (ex.: Finalizar Processo) */
export const buttonTertiaryLabelStyle = {
  fontFamily: "Open Sans, sans-serif",
  fontWeight: 500,
  fontStyle: "normal" as const,
  fontSize: "15px",
  lineHeight: "22px",
  letterSpacing: "0%",
} as const;

const buttonTertiaryLabelCss = `
  font-family: ${buttonTertiaryLabelStyle.fontFamily};
  font-weight: ${buttonTertiaryLabelStyle.fontWeight};
  font-style: ${buttonTertiaryLabelStyle.fontStyle};
  font-size: ${buttonTertiaryLabelStyle.fontSize};
  line-height: ${buttonTertiaryLabelStyle.lineHeight};
  letter-spacing: ${buttonTertiaryLabelStyle.letterSpacing};
`;

const tertiaryBorderRadius = 5;

const { disabled: buttonDisabled } = tokens.button;

/** Cores do estado desabilitado dos botões (primary, secondary, tertiary) */
export const buttonDisabledStyle = {
  backgroundColor: buttonDisabled.background,
  borderColor: buttonDisabled.border,
  color: buttonDisabled.text,
} as const;

const buttonDisabledStateSelectors = `
  &&&:disabled,
  &&&.ant-btn-disabled,
  &&&[disabled],
  &&&.ant-btn-disabled:hover,
  &&&.ant-btn-disabled:focus,
  &&&:disabled:hover,
  &&&:disabled:focus
`;

const buttonDisabledCss = `
  ${buttonDisabledStateSelectors} {
    cursor: not-allowed !important;
    background-color: ${buttonDisabled.background} !important;
    border-color: ${buttonDisabled.border} !important;
    color: ${buttonDisabled.text} !important;
    box-shadow: none !important;
  }

  ${buttonDisabledStateSelectors} .anticon,
  ${buttonDisabledStateSelectors} .ant-btn-icon {
    color: ${buttonDisabled.text} !important;
  }
`;

export const PrimaryButtonStyled = styled(Button)`
  &&& {
    min-width: ${tokens.button.minWidth}px;
    height: ${controlHeight}px !important;
    border-radius: ${borderRadius}px !important;
    padding: 0 1rem;
    ${buttonLabelCss}
    background-color: ${colors.primary} !important;
    border-color: ${colors.primary} !important;
    color: ${colors.white} !important;
  }

  &&&:hover:not(:disabled),
  &&&:focus:hover:not(:disabled) {
    background-color: ${colors.secondary} !important;
    border-color: ${colors.secondary} !important;
    color: ${colors.white} !important;
  }

  &&&:focus:not(:disabled) {
    background-color: ${colors.primary} !important;
    border-color: ${colors.primary} !important;
    color: ${colors.white} !important;
  }

  ${buttonDisabledCss}
`;

export const SecondaryButtonStyled = styled(Button)`
  &&& {
    min-width: ${tokens.button.minWidth}px;
    height: ${controlHeight}px !important;
    border-radius: ${borderRadius}px;
    border: 1px solid ${colors.secondary} !important;
    color: ${colors.secondary} !important;
    background-color: ${colors.bgContainer} !important;
    ${buttonLabelCss}
    padding: 0 1rem;
    box-shadow: none !important;
  }

  &&&:hover:not(:disabled),
  &&&:focus:hover:not(:disabled) {
    border-color: ${colors.secondary} !important;
    color: ${colors.primary} !important;
    background-color: ${colors.bgContainer} !important;
    box-shadow: none !important;
  }

  &&&:hover:not(:disabled) .anticon,
  &&&:focus:hover:not(:disabled) .anticon {
    color: ${colors.primary} !important;
  }

  &&&:focus:not(:disabled) {
    border-color: ${colors.secondary} !important;
    color: ${colors.secondary} !important;
    background-color: ${colors.bgContainer} !important;
  }

  ${buttonDisabledCss}
`;

export const TertiaryButtonStyled = styled(Button)`
  &&& {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 100px;
    width: auto;
    height: 26px !important;
    padding: 0 20px;
    border-radius: ${tertiaryBorderRadius}px !important;
    border: 1px solid ${colors.secondary} !important;
    color: ${colors.secondary} !important;
    background-color: ${colors.bgContainer} !important;
    ${buttonTertiaryLabelCss}
    box-shadow: none !important;
  }

  &&&:hover:not(:disabled),
  &&&:focus:hover:not(:disabled) {
    border-color: ${colors.secondary} !important;
    color: ${colors.primary} !important;
    background-color: ${colors.bgContainer} !important;
    box-shadow: none !important;
  }

  &&&:hover:not(:disabled) .anticon,
  &&&:focus:hover:not(:disabled) .anticon {
    color: ${colors.primary} !important;
  }

  &&&:focus:not(:disabled) {
    border-color: ${colors.secondary} !important;
    color: ${colors.secondary} !important;
    background-color: ${colors.bgContainer} !important;
  }

  ${buttonDisabledCss}
`;

/** Botões de modais de confirmação */
export const confirmationModalWidth = 720;

export const confirmationModalButtonStyles = {
  cancelButton: {
    width: 220,
    height: 52,
    marginTop: 0,
  },
  confirmButton: {
    width: 260,
    height: 52,
  },
  footerCentered: {
    display: "flex",
    justifyContent: "center",
    gap: 48,
    paddingTop: 8,
  },
  footerCenteredSingle: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 8,
  },
  antdStyles: {
    body: { padding: "28px 24px 8px 24px" },
    footer: { padding: "18px 24px 28px 24px" },
  },
  contentColumn: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 22,
  },
  warningIconDanger: { fontSize: 72, color: "#F5222D" },
  warningIconWarning: { fontSize: 72, color: "#F5B800" },
  successIconLarge: { fontSize: 92, color: "#51B05B" },
  messageBlock: {
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
};

/** @deprecated Use confirmationModalButtonStyles */
export const confirmationModalStyles = {
  ...confirmationModalButtonStyles,
  titleText: {
    fontFamily,
    fontSize: 28,
    lineHeight: "36px",
    color: colors.textPrimary,
  },
  subtitleText: {
    fontFamily,
    fontSize: 20,
    lineHeight: "28px",
    color: colors.textPrimary,
  },
  singleTitleText: {
    textAlign: "center" as const,
    fontFamily,
    fontSize: 28,
    lineHeight: "36px",
    color: colors.textPrimary,
  },
};


// ===== statCard.ts =====

export const StyledCardPequeno = styled(Card)`
  width: 12.5rem;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #cecacaff;
  margin: 1rem 1rem 1rem 0;
`;

export const StyledCardGrande = styled(Card)`
  width: 15.625rem;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
`;

export const CardIconContainer = styled.div`
  width: 3.75rem;
  background-color: #05409a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
`;

export const CardContentContainer = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StatCardActionButton = styled(SecondaryButtonStyled)`
  margin: 0.625rem 0.5rem 0.625rem 0;
  border-radius: 0.3125rem;
`;

export const StatCardPrimaryActionButton = styled(PrimaryButtonStyled)`
  margin: 0.625rem 0.5rem 0.625rem 0;
  border-radius: 0.3125rem;
`;

/** Botão "Finalizar Processo" — usa o estilo tertiary */
export const FinalizarButton = TertiaryButtonStyled;