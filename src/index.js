import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import theme from "./themes/theme.ts";
import { CssBaseline } from "@mui/material";
import { ApolloProvider } from "@apollo/client";

import client from "./graphql/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme>
          <App />
        </CssBaseline>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
