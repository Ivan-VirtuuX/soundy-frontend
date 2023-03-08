import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#181F92",
    },
    secondary: {
      main: "#E8338B",
    },
    success: {
      main: "#7DCF3C",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: "10px",
      },
      contained: {
        boxShadow: "none",
        backgroundColor: "#181F92",
        transition: "all 0.4s ease-in-out",
        fontSize: 23,
        color: "white",
        fontWeight: 700,
        textTransform: "none",

        "&:hover": {
          boxShadow: "none",
          backgroundColor: "#E8338B",
        },
      },
      outlined: {
        boxShadow: "none",
        transition: "all 0.4s ease-in-out",
        fontSize: 15,
        fontWeight: 700,
        textTransform: "none",
        fontFamily: "Comfortaa",
        width: 200,
        padding: "10px 15px",
        color: "#181F92",
        background: "rgba(24,31,146,0.1)",
        border: "none !important",

        "&:hover": {
          boxShadow: "none",
          color: "#E8338B",
          background: "rgba(232,51,139,0.1) !important",
        },
      },
      text: {
        boxShadow: "none",
        transition: "all 0.4s ease-in-out",
        fontSize: 15,
        color: "#181F92",
        fontWeight: 700,
        textTransform: "none",
        fontFamily: "Comfortaa",
        width: 200,
        padding: "10px 15px",

        "&:hover": {
          boxShadow: "none",
          backgroundColor: "#E8338B",
        },
      },
    },
  },
});
