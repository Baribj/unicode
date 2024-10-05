export const mira = {
  color: {
    darkMode: {
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
      },

      background: {
        default: "#0d1117",
        paper: "#0d1117",
        secondary: "rgb(22, 27, 34, 1)",
        tertiary: "#2530402e",
        glassmorphism: "rgb(22, 27, 34, 0.90)",
      },

      divider: "#33363cba",

      text: {
        primary: "#ffffffcc",
        secondary: "#ffffff99",
        disabled: "#ffffff66",
      },

      red: {
        main: "#fe5952",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      orange: {
        main: "#ff915f",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      green: {
        main: "#0db94d",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      blue: {
        main: "#6f88ff",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      purple: {
        main: "#ab7afd",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      pink: {
        main: "#fc57aa",
        contrastText: "rgba(0, 0, 0, 1)",
      },
    },
    lightMode: {
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
      },

      background: {
        secondary: "rgb(247, 247, 247, 1)",
        tertiary: "#ecececa1",
        glassmorphism: "rgb(247, 247, 247, 0.8)",
      },

      text: {
        primary: "#000000cc",
        secondary: "#00000099",
        disabled: "#00000066",
      },

      divider: "rgba(0,0,0,0.12)",

      red: {
        main: "#fe5952",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      orange: {
        main: "#ff915f",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      green: {
        main: "#0db94d",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      blue: {
        main: "#6f88ff",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      purple: {
        main: "#ab7afd",
        contrastText: "rgba(0, 0, 0, 1)",
      },
      pink: {
        main: "#fc57aa",
        contrastText: "rgba(0, 0, 0, 1)",
      },
    },
  },
};

export type ThemeColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

export type ThemeExtendedColor =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "pink";
