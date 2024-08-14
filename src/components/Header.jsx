// src/components/Header.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

function Header({ imageUrl }) {
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
        <img src="assets/logo.svg" style={{marginTop: '15px', marginLeft: '87px'}}/>
      </Box>
      <Box
        component="header"
        sx={{
          width: "100%",
          overflow: "hidden",
          background: "#0538AF",
          marginBottom: 4,
        }}
      >
        <img
          src={imageUrl}
          alt="Header"
          style={{ width: "50%", height: "auto", float: "right" }}
        />
        <Box sx={{ margin: 4, padding: 3 }}>
          <Typography variant="h2" gutterBottom sx={{ marginTop: '15px', marginLeft: '30px', color: "#fff" }}>
            Explorers
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#fff", marginLeft: '30px' }}>
            List of Cardano Explorers from our Community and Foundation.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Header;
