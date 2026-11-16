export const tokens = {
  controlHeight: 40,
  borderRadius: 8,
  fontFamily: "Open Sans, sans-serif",

  colors: {
    primary: "#002C8C",
    secondary: "#0F59C8",
    white: "#FFFFFF",
    bgContainer: "#FFFFFF",
    textPrimary: "#1C1D22",
    actionIconDisabled: "#838383",
    actionIconEdit: "#0F59C8",
    actionIconView: "#16a34a",
    actionIconDelete: "#ff4d4f",
  },

  typography: {
    label: {
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: 0,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: 0,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: 0,
    },
  },

  button: {
    minWidth: 124,
    fontWeight: 600,
    fontSize: 16,
    disabled: {
      background: "#f5f5f5",
      border: "#d9d9d9",
      text: "rgba(0, 0, 0, 0.25)",
    },
  },

  actionIcon: {
    edit: {
      width: "0.9765625rem",
      height: "0.9765625rem",
      fontSize: "0.9765625rem",
    },
    view: {
      width: "1.2164474725723267rem",
      height: "0.9095982313156128rem",
      fontSize: "0.9095982313156128rem",
    },
    delete: {
      width: "1.07125rem",
      height: "1.11625rem",
      fontSize: "1.07125rem",
    },
    settings: {
      width: "1rem",
      height: "1rem",
      fontSize: "1rem",
    },
  },

  tabs: {
    barBg: "transparent",
    barPadding: "0 1.5rem",
    barBorderColor: "#EBEBED",
    inkBarColor: "#0F59C8",
    activeColor: "#0F59C8",
    inactiveColor: "#515151",
    disabledColor: "#B1B2B7",
    hoverColor: "#002C8C",
    activeFontWeight: 600,
    inactiveFontWeight: 400,
    titleFontSize: 16,
  },
} as const;
