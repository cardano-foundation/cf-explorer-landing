// src/components/Header.jsx
import React from "react";
import { Box, Typography, styled, IconButton, Stack, Chip } from "@mui/material";
import cardanoLogoBlue from "/assets/logo.svg";
import cardanoLogoWhite from "/assets/logo-white.svg";
import { LightMode, DarkMode, GitHub } from "@mui/icons-material";
import { lightTheme, darkTheme } from "src/common/style/theme";

export const HeaderSection = styled("header")`
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: url("/assets/hero-banner.svg");

  &::before {
    content: "";
    height: 344px;
    position: absolute;
    inset: 0;
    background-image: linear-gradient(248deg, #305bbd, #0035ad);
    z-index: -1;
  }
`;

function Header({ toggleTheme, isDarkMode }) {
  const theme = isDarkMode ? darkTheme : lightTheme;
  const path = window.location.pathname;
  const currentNetwork = path.startsWith("/preprod") ? "preprod"
                       : path.startsWith("/preview") ? "preview"
                       : "mainnet";
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "64px",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <a href={import.meta.env.VITE_CARDANO_URL}>
            <img
              src={isDarkMode ? cardanoLogoWhite : cardanoLogoBlue}
              style={{ margin: "1rem 0 0 2.05rem" }}
            />
          </a>
          <Box sx={{mr: "1rem"}}>
            <a
              href={import.meta.env.VITE_GITHUB_URL}
              style={{ marginLeft: "2rem", marginTop: "1rem" }}
            >
              <IconButton
                sx={{ color: theme.palette.text.primary }}
              >
                <GitHub />
              </IconButton>
            </a>
            <IconButton
              onClick={toggleTheme}
              sx={{ color: theme.palette.text.primary }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <HeaderSection>
        <Box
          sx={{
            margin: {
              xs: "3rem 2.05rem 0 2.05rem;",
              sm: "5rem 2.05rem 0 4.05rem",
            },
            color: "#fff",
          }}
        >
          <Typography variant="h1" gutterBottom>
            Explorers
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            List of Cardano Explorers built by the community for the community.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Chip label="Mainnet" size="small" component="a" href="/"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "#fff", cursor: "pointer",
                        backgroundColor: currentNetwork === "mainnet" ? "rgba(255,255,255,0.2)" : "transparent" }} />
            <Chip label="Preprod" size="small" component="a" href="/preprod"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "#fff", cursor: "pointer",
                        backgroundColor: currentNetwork === "preprod" ? "rgba(255,255,255,0.2)" : "transparent" }} />
            <Chip label="Preview" size="small" component="a" href="/preview"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "#fff", cursor: "pointer",
                        backgroundColor: currentNetwork === "preview" ? "rgba(255,255,255,0.2)" : "transparent" }} />
          </Box>
        </Box>
      </HeaderSection>
    </>
  );
}

export default Header;
