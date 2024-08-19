// src/components/Header.jsx
import React from "react";
import { Box, Typography, styled } from "@mui/material";
import cardanoLogo from "/assets/logo.svg";
import githubLogo from "/assets/github.svg";

export const HeaderSection = styled("header")`
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #0538AF url('/assets/hero-banner.svg');
`;

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
        <HeaderSection>
            <Box sx={{margin: '0 auto', padding: '83px'}}>
                <Typography variant="h1" gutterBottom
                            sx={{margin: '1rem 0 0 1.05rem', color: "#fff", fontSize: '3rem', fontWeight: '700'}}>
                    Explorers
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{color: "#fff", margin: '1rem 0 0 1.05rem'}}>
                    List of Cardano Explorers from our Community and Foundation.
                </Typography>
            </Box>
        </HeaderSection>
    </>
  );
}

export default Header;
