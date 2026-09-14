export const colors = {
  primary: "#183356",
  blue: "#0068bc",
  blueBackground: "rgba(0, 104, 188, 0.1)",
  blueBackgroundSoft: "rgba(0, 104, 188, 0.06)",
  activeBlue: "#0f59c8",
  menuItemActiveBackground: "#0f59c8",
  menuBackground: "#183356",

  primaryText: "#1c1d22",
  secondaryText: "#838383",
  tertiaryText: "#71717a",

  border: "#dadada",
  lightBorder: "#dadee6",

  appBackground: "#fafafa",
  stripedBackground: "#f8f9fa",
  white: "#ffffff",

  success: "#009c0a",
  successBackground: "rgba(0, 156, 10, 0.1)",
  error: "#bc0000",
  errorBackground: "rgba(188, 0, 0, 0.1)",
  neutral: "#838383",
  neutralBackground: "rgba(131, 131, 131, 0.1)",

  completeBackground: "#f5f5f5",
  completeText: "#bfbfbf",

  headerUserBackground: "#f5f6f8",
  headerUserText: "#42474a",
  footerVersionText: "#595959",
} as const;

export const typography = {
  fontFamily:
    '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyRoboto:
    'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSizeBase: 14,
  fontSizeTitle: 24,
  fontSizeSubtitle: 20,
  fontSizeCaption: 12,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const layout = {
  menuWidth: 104,
  headerHeight: 72,
  footerHeight: 65,
  controlHeight: 40,
  radius: 8,
  cardShadow:
    "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 8px 24px 0px rgba(0, 0, 0, 0.16)",
  headerShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.12)",
} as const;

export const tokens = { colors, typography, spacing, layout } as const;

export const tema = tokens;
export type Tema = typeof tema;

export default tokens;
