import type { ThemeConfig } from "antd";
import { tokens } from "./tokens";

const { colors, controlHeight, borderRadius, fontFamily } = tokens;

export const antdTheme: ThemeConfig = {
  token: {
    colorBgLayout: "#FAFAFA",
    colorPrimary: colors.primary,
    fontFamily,
    borderRadius,
    colorBgContainer: colors.bgContainer,
    colorBgBase: "#FAFAFA",
    colorTextLightSolid: colors.white,
    colorError: "#DB001B",
    colorText: "#1C1D22",
    colorTextSecondary: "#515151",
    colorTextDescription: "#515151",
    fontSize: 16,
    fontWeightStrong: 700,
    fontWeight: 400,
    controlPaddingHorizontal: 20,
  },
  components: {
    Form: {
      labelFontSize: tokens.typography.label.fontSize,
      labelColor: tokens.colors.textPrimary,
      labelFontWeight: tokens.typography.label.fontWeight,
      labelRequiredMarkColor: "#515151",
    },
    Typography: {
      fontWeight: 400,
    },
    Layout: {
      headerBg: colors.bgContainer,
    },
    Table: {
      headerBg: "#EBEBED",
      headerSplitColor: "transparent",
      rowBg: colors.bgContainer,
      rowSelectedBg: "#F6F6F6",
    },
    Pagination: {
      colorPrimary: colors.white,
      itemActiveBg: colors.primary,
    },
    Button: {
      controlHeight,
      controlHeightLG: controlHeight,
      controlHeightSM: 35,
      fontSizeLG: 16,
      fontSizeSM: 14,
      fontSize: tokens.button.fontSize,
      paddingInlineSM: 12,
      paddingBlockSM: 4,
      paddingInlineLG: 20,
      paddingBlockLG: 4,
      controlLineWidth: 1,
      controlOutlineWidth: 1,
      borderRadius,
      colorBorder: "#B1B2B7",
      defaultBg: colors.bgContainer,
      paddingInline: 20,
      paddingBlock: 20,
      fontWeight: tokens.button.fontWeight,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.secondary,
      colorPrimaryActive: colors.primary,
      colorTextDisabled: tokens.button.disabled.text,
      colorBgContainerDisabled: tokens.button.disabled.background,
      borderColorDisabled: tokens.button.disabled.border,
    },
    Input: {
      controlHeight,
      borderRadius,
    },
    Select: {
      controlHeight,
      borderRadius,
    },
    InputNumber: {
      controlHeight,
      borderRadius,
    },
    DatePicker: {
      controlHeight,
      borderRadius,
    },
    Card: {
      fontWeight: 400,
      headerFontSize: 18,
      headerColor: "#515151",
      colorText: "#515151",
      headerLineHeight: 1.2,
      headerBorderWidth: 0,
    },
    Tabs: {
      inkBarColor: tokens.tabs.inkBarColor,
      itemColor: tokens.tabs.inactiveColor,
      itemSelectedColor: tokens.tabs.activeColor,
      itemHoverColor: tokens.tabs.hoverColor,
      itemActiveColor: tokens.tabs.activeColor,
      titleFontSize: tokens.tabs.titleFontSize,
    },
    Steps: {
      colorPrimary: "#1890FF",
      colorTextDescription: "#00000073",
      colorText: "#515151",
      controlItemBgHover: "#F0F7FF",
      controlItemTextColor: "#00000073",
      controlItemBgActive: "transparent",
    },
  },
};

/** @deprecated Import from design-system/antdTheme */
export const theme = antdTheme;
