"use client";

import React from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider, PaletteMode, ThemeOptions, createTheme } from "@mui/material";

type PaletteOptions = Required<ThemeOptions>["palette"];

const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const light: PaletteOptions = {};

  const dark: PaletteOptions = {
    background: {
      default: "#111418",
      paper: "#0F1924",
    },
  };

  const palette = mode === "light" ? light : dark;

  return {
    palette: {
      mode,
      ...palette,
    },
  };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, _setMode] = React.useState<PaletteMode>("dark");

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
