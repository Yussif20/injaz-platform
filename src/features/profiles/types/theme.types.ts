/**
 * Theme Types for Portfolio Preview
 */

export type ThemeName = "default" | "dark" | "heritage" | "arabic";

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  cardBg: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
  circleColor: string; // For theme selector
}

export const PORTFOLIO_THEMES: Record<ThemeName, Theme> = {
  default: {
    name: "default",
    label: "افتراضي",
    circleColor: "#008387",
    colors: {
      primary: "#008387",
      primaryLight: "#e3efef",
      primaryDark: "#006366",
      background: "#ffffff",
      cardBg: "#f8fafa",
      text: "#12263a",
      textMuted: "#6b7280",
      border: "#e3efef",
      accent: "#008387",
    },
  },
  dark: {
    name: "dark",
    label: "داكن",
    circleColor: "#12263a",
    colors: {
      primary: "#12263a",
      primaryLight: "#1a3a5c",
      primaryDark: "#0a121c",
      background: "#0e1c2b",
      cardBg: "#12263a",
      text: "#ffffff",
      textMuted: "#a3c3c3",
      border: "#2d4d7d",
      accent: "#00cfcc",
    },
  },
  heritage: {
    name: "heritage",
    label: "تراثي",
    circleColor: "#6b2a3d",
    colors: {
      primary: "#6b2a3d",
      primaryLight: "#f5e6ea",
      primaryDark: "#4a1d2b",
      background: "#faf7f5",
      cardBg: "#f5eeeb",
      text: "#3d2a2e",
      textMuted: "#8b7a7e",
      border: "#e8dcd8",
      accent: "#8b4557",
    },
  },
  arabic: {
    name: "arabic",
    label: "عربي",
    circleColor: "#5c4033",
    colors: {
      primary: "#5c4033",
      primaryLight: "#f5efe8",
      primaryDark: "#3d2a22",
      background: "#faf8f5",
      cardBg: "#f0ebe3",
      text: "#3d3028",
      textMuted: "#8b7e70",
      border: "#e0d6c8",
      accent: "#8b6f47",
    },
  },
};
