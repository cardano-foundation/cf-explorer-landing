// src/components/Header.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

function Header() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "64px",
          overflow: "hidden",
          background: "#FFF"
        }}
      >
        <img src="assets/logo.svg" style={{margin: '1rem 0 0 1.05rem'}}/>
      </Box>
      <Box
        component="header"
        sx={{
          width: "100%",
          overflow: "hidden",
          background: "#0538AF",
        }}
      >
        <Box sx={{ marginLeft: 4, padding: 3 }}>
          <Typography variant="h1" gutterBottom sx={{ margin: '1rem 0 0 1.05rem', color: "#fff", fontSize: '3rem', fontWeight: '700' }}>
            Explorers
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#fff", margin: '1rem 0 0 1.05rem' }}>
            List of Cardano Explorers from our Community and Foundation.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Header;
