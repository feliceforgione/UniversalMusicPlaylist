//import { blue, pink, purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#783f04",
      contrastText: "#E4D9CE",
      light: "#a78f78",
      dark: "#66503c",
    },
    secondary: {
      main: "#af7e4c",
    },
    background: {
      default: "#94887b",
      paper: "#7b827f",
    },
    text: {
      primary: "#3d2e1e",
      secondary: "#533e28",
    },
    divider: "#533e28",
  },
});

export default appTheme;
