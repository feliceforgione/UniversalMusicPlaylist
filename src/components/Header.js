import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import "../themes/components.css";
import { StyledEngineProvider } from "@mui/material/styles";

function Header() {
  return (
    <StyledEngineProvider injectFirst>
      <AppBar position="fixed" color="primary">
        <Toolbar className="appBar">
          <img src="logo.jpg" alt="logo" />

          <Typography className="title" variant="h6" component="h1">
            Play all your online music with ONE player
          </Typography>
        </Toolbar>
      </AppBar>
    </StyledEngineProvider>
  );
}

export default Header;
