import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontSize: "1.5rem", // モバイル向け
          "@media (min-width:600px)": {
            fontSize: "2rem", // タブレット向け
          },
          "@media (min-width:960px)": {
            fontSize: "2.5rem", // デスクトップ向け
          },
        },
        body1: {
          fontSize: "0.875rem", // モバイル向け
          "@media (min-width:600px)": {
            fontSize: "1rem", // タブレット向け
          },
          "@media (min-width:960px)": {
            fontSize: "1.125rem", // デスクトップ向け
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 16px", // モバイル向け
          "@media (min-width:600px)": {
            padding: "10px 20px", // タブレット向け
          },
          "@media (min-width:960px)": {
            padding: "12px 24px", // デスクトップ向け
          },
        },
      },
    },
  },
});

export default theme;