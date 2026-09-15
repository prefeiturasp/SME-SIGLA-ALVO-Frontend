import type { ThemeConfig } from "antd";
import { colors, typography, layout, spacing } from "@locus/estilos/tokens/tokens";

export const temaAntd: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorLink: colors.blue,
    colorInfo: colors.blue,
    colorSuccess: colors.success,
    colorError: colors.error,
    colorText: colors.primaryText,
    colorTextSecondary: colors.secondaryText,
    colorTextDisabled: colors.secondaryText,
    colorBorder: colors.border,
    colorBgContainer: colors.white,
    colorBgLayout: colors.appBackground,
    colorBgContainerDisabled: colors.completeBackground,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeBase,
    borderRadius: layout.radius,
    controlHeight: layout.controlHeight,
    boxShadowSecondary: layout.cardShadow,
    boxShadowTertiary: layout.cardShadow,
  },
  components: {
    Input: {
      paddingInline: spacing.md,
      paddingBlock: spacing.sm,
      hoverBorderColor: colors.border,
      activeBorderColor: colors.border,
      activeShadow: "none",
    },
    Select: {
      controlHeight: layout.controlHeight,
      borderRadius: layout.radius,
      optionSelectedBg: colors.stripedBackground,
      colorTextDisabled: colors.secondaryText,
      colorBgContainerDisabled: colors.completeBackground,
    },
    Form: {
      labelColor: colors.primaryText,
      labelFontSize: typography.fontSizeBase,
      labelRequiredMarkColor: colors.error,
    },
    Layout: {
      headerBg: colors.white,
      headerHeight: layout.headerHeight,
      headerPadding: "0 24px",
      bodyBg: colors.appBackground,
      footerBg: colors.white,
      footerPadding: "16px 40px",
      siderBg: colors.menuBackground,
    },
    Menu: {
      darkItemBg: colors.menuBackground,
      darkSubMenuItemBg: colors.menuBackground,
      darkItemSelectedBg: colors.menuItemActiveBackground,
      darkItemColor: "rgba(255, 255, 255, 0.85)",
      darkItemSelectedColor: colors.white,
    },
    Table: {
      headerBg: colors.stripedBackground,
      headerColor: colors.primaryText,
      rowHoverBg: colors.stripedBackground,
      borderColor: colors.border,
    },
    Pagination: {
      itemActiveBg: colors.white,
      itemSize: layout.controlHeight,
      itemActiveColorDisabled: colors.secondaryText,
      colorPrimary: colors.activeBlue,
      colorPrimaryHover: colors.activeBlue,
      colorText: colors.primaryText,
      itemLinkBg: "transparent",
    },
    Card: {
      boxShadowTertiary: layout.cardShadow,
      colorBgContainer: colors.white,
    },
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      fontWeight: 600,
      controlHeight: layout.controlHeight,
      borderRadius: layout.radius,
      defaultBorderColor: colors.blue,
      defaultColor: colors.blue,
      defaultHoverBorderColor: colors.blue,
      defaultHoverColor: colors.blue,
      defaultActiveBorderColor: colors.blue,
      defaultActiveColor: colors.blue,
      // Cor do texto dos botoes danger de fundo claro (text/default).
      dangerColor: colors.error,
      // O primary danger tem fundo vermelho: o texto precisa ser branco.
      primaryColor: colors.white,
    },
    Segmented: {
      itemSelectedBg: colors.activeBlue,
      itemSelectedColor: colors.white,
      itemColor: colors.primaryText,
      trackBg: "transparent",
      borderRadius: layout.radius,
      controlHeight: layout.controlHeight,
    },
    InputNumber: {
      controlHeight: layout.controlHeight,
      borderRadius: layout.radius,
      hoverBorderColor: colors.border,
      activeBorderColor: colors.border,
      activeShadow: "none",
    },
    Switch: {
      colorPrimary: colors.blue,
      colorPrimaryHover: colors.blue,
    },
  },
};

export default temaAntd;
