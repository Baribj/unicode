import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { mira } from "./miraTheme";
import { useEffect } from "react";
import {
  getLocalStorageThemeMode,
  setLocalStorageThemeMode,
} from "../utils/localStorageHelpers";

interface ThemeModeContextInterface {
  themeMode: string;
  setThemeMode: Dispatch<SetStateAction<string>>;
}

export const ThemeModeContext = createContext<ThemeModeContextInterface>({
  themeMode: "light",
  setThemeMode: () => {},
});

const dark = {
  palette: { mode: "dark", ...mira.color.darkMode },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fieldset: {
            borderColor: mira.color.darkMode.divider,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mira.color.darkMode.text.disabled,
        },
      },
    },
  },
};

const light = {
  mode: "light",
  palette: { ...mira.color.lightMode },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fieldset: {
            borderColor: mira.color.lightMode.divider,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: mira.color.lightMode.text.disabled,
        },
      },
    },
  },
};

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState("dark");

  useEffect(() => {
    if (getLocalStorageThemeMode()) {
      setThemeMode(getLocalStorageThemeMode());
    } else {
      setThemeMode("dark");
      setLocalStorageThemeMode("dark");
    }
  }, [setThemeMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          ...(themeMode === "light" ? light.palette : dark.palette),
        },

        components: {
          ...(themeMode === "light" ? light.components : dark.components),
        },

        shape: {
          borderRadius: 5,
        },

        typography: {
          fontFamily: "Roboto",

          button: {
            textTransform: "none",
          },
        },
      }),
    [themeMode]
  );

  return (
    <>
      <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeModeContext.Provider>
    </>
  );
};

export default CustomThemeProvider;

declare module "@mui/material/styles" {
  interface Palette {
    red: {
      main: string;
      contrastText: string;
    };
    orange: {
      main: string;
      contrastText: string;
    };
    green: {
      main: string;
      contrastText: string;
    };
    blue: {
      main: string;
      contrastText: string;
    };
    purple: {
      main: string;
      contrastText: string;
    };
    pink: {
      main: string;
      contrastText: string;
    };
  }

  interface TypeBackground {
    glassmorphism: string;
    tertiary: string;
    secondary: string;
  }
}

// this adds our custom colors to the Chip component so we can pass the prop color="pink".
// Might be worth it to find something that will add this to all components.
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    red: true;
    orange: true;
    green: true;
    blue: true;
    purple: true;
    pink: true;
  }
}
