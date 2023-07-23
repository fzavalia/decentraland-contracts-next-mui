"use client";

import React from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";

const baseColor = "#0F1924";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: baseColor,
      paper: baseColor,
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
