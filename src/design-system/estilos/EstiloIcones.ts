import type { CSSProperties } from "react";
import { tokens } from "../tokens";

const { colors, actionIcon } = tokens;

const editBase: CSSProperties = {
  width: actionIcon.edit.width,
  height: actionIcon.edit.height,
  fontSize: actionIcon.edit.fontSize,
};

const viewBase: CSSProperties = {
  width: actionIcon.view.width,
  height: actionIcon.view.height,
  fontSize: actionIcon.view.fontSize,
};

const deleteBase: CSSProperties = {
  width: actionIcon.delete.width,
  height: actionIcon.delete.height,
  fontSize: actionIcon.delete.fontSize,
};

const settingsBase: CSSProperties = {
  width: actionIcon.settings.width,
  height: actionIcon.settings.height,
  fontSize: actionIcon.settings.fontSize,
};

/** Lápis desabilitado */
export const editIcon: CSSProperties = {
  ...editBase,
  color: colors.actionIconDisabled,
};

/** Lápis habilitado (azul) */
export const editIconEnabled: CSSProperties = {
  ...editBase,
  color: colors.actionIconEdit,
};

/** Olho / visualizar (verde) */
export const viewIcon: CSSProperties = {
  ...viewBase,
  color: colors.actionIconView,
};

/** Lixeira desabilitada */
export const deleteIcon: CSSProperties = {
  ...deleteBase,
  color: colors.actionIconDisabled,
};

/** Lixeira habilitada (vermelho) */
export const deleteIconEnabled: CSSProperties = {
  ...deleteBase,
  color: colors.actionIconDelete,
};

/** Engrenagem / configurações (azul) */
export const settingsIcon: CSSProperties = {
  ...settingsBase,
  color: colors.actionIconEdit,
};

export function getEditIconStyle(disabled?: boolean): CSSProperties {
  return disabled ? editIcon : editIconEnabled;
}

export function getDeleteIconStyle(disabled?: boolean): CSSProperties {
  return disabled ? deleteIcon : deleteIconEnabled;
}

/** Ícones de confirmação/cancelamento em tabelas editáveis */
export const tableConfirmIcon = { color: colors.actionIconEdit };
export const tableCancelIcon = { color: colors.actionIconDelete };
export const tableDeleteIconAction = {
  cursor: "pointer" as const,
  fontSize: "18px",
  color: colors.actionIconDelete,
};

export const editableTableStyles = {
  saveIcon: tableConfirmIcon,
  cancelIcon: tableCancelIcon,
  editIcon: tableConfirmIcon,
  deleteIcon: tableDeleteIconAction,
  actionsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 4,
  },
  editRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center" as const,
  },
  actionsCell: {
    width: 56,
    display: "flex",
    justifyContent: "center",
    gap: 2,
  },
  hiddenPlaceholder: { visibility: "hidden" as const },
  inputEditWidth60: { width: 60 },
  inputEditGreen: { width: 60, color: "#0A8F3A" },
  inputEditGreenDisabled: {
    width: 60,
    backgroundColor: "#fff",
    color: "#0A8F3A",
  },
  flexRowGap8: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

/** @deprecated Use editIconEnabled */
export const brandHighlightText = { color: colors.actionIconEdit };

/** @deprecated Use colors.secondary */
export const brandSecondaryText = { color: colors.secondary };

/** @deprecated Use editIconEnabled */
export const iconPrimary = { color: colors.actionIconEdit };


// convocacaoTable

export const sortIconContainer = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "0.0625rem",
  cursor: "pointer",
};

export const sortIconUp = (isActive: boolean) => ({
  color: isActive ? "#1890ff" : "#BFBFBF",
  fontSize: "0.5rem",
  lineHeight: "1",
});

export const sortIconDown = (isActive: boolean) => ({
  color: isActive ? "#1890ff" : "#BFBFBF",
  fontSize: "0.5rem",
  lineHeight: "1",
});

export const statusContainer = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const statusDot = (color: string) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "50%",
  backgroundColor: color,
  flexShrink: 0,
});

export const statusText = {
  fontFamily: "Open Sans",
  fontSize: "0.875rem",
  color: "#515151",
};

export const statusHeaderContainer = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const emptyTextContainer = {
  padding: "2.5rem 0",
  textAlign: "center" as const,
  color: "#8C8C8C",
  fontSize: "1rem",
  fontFamily: "Inter, sans-serif",
};

export const hiddenButton = {
  visibility: "hidden" as const,
};
