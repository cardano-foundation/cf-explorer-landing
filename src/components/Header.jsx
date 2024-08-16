// src/components/Header.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import cardanoLogo from "../../public/assets/logo.svg";
import githubLogo from "../../public/assets/github.svg";

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
            <img src={cardanoLogo} style={{margin: '1rem 0 0 1.05rem'}}/>
            <a href={import.meta.env.VITE_GITHUB_URL}>
                <img src={githubLogo} style={{float: "right", margin: '1rem 1.05rem 0 0'}}/>
            </a>
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
