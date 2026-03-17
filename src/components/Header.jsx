// src/components/Header.jsx
import React, { useState } from "react";
import { Box, Typography, styled, IconButton, Stack, Chip, Popover } from "@mui/material";
import cardanoLogoBlue from "/assets/logo.svg";
import cardanoLogoWhite from "/assets/logo-white.svg";
import { LightMode, DarkMode, GitHub, HelpOutline } from "@mui/icons-material";
import { lightTheme, darkTheme } from "src/common/style/theme";

const DEEPLINK_PATTERNS = [
  {
    label: "Epoch",
    schema: "/epoch/{EPOCH_NUMBER}  ·  /epoch?number={EPOCH_NUMBER}",
    description: "A non-negative integer representing the epoch (e.g. 42).",
  },
  {
    label: "Block",
    schema: "/block/{BLOCK_NUMBER}  ·  /block?id={BLOCK_NUMBER}",
    description: "A block height (integer) or a 64-character hex block hash.",
  },
  {
    label: "Transaction",
    schema: "/transaction/{TRANSACTION_ID}  ·  /transaction?id={TRANSACTION_ID}",
    description: "A 64-character hex transaction hash.",
  },
  {
    label: "Address",
    schema: "/address/{ADDRESS}  ·  /address?address={ADDRESS}",
    description: "A bech32 address starting with addr1… (Shelley) or Ae2… (Byron).",
  },
  {
    label: "Governance Action",
    schema: "/governance-action/{GOVERNANCE_ACTION_ID}  ·  /governance-action?id={GOVERNANCE_ACTION_ID}",
    description: "A governance action ID as bech32 (gov_action1…) or raw hex.",
  },
];

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
  const [helpAnchor, setHelpAnchor] = useState(null);
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
          <Box sx={{ mr: "1rem" }}>
            <IconButton
              onClick={(e) => setHelpAnchor(e.currentTarget)}
              sx={{ color: theme.palette.text.primary }}
              aria-label="Deeplink help"
            >
              <HelpOutline />
            </IconButton>
            <Popover
              open={Boolean(helpAnchor)}
              anchorEl={helpAnchor}
              onClose={() => setHelpAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    borderRadius: "12px",
                    p: 2.5,
                    maxWidth: 420,
                    overflow: "visible",
                    mt: "6px",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -8,
                      right: 12,
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderBottom: "8px solid rgba(0,0,0,0.75)",
                    },
                  },
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, letterSpacing: 0.3 }}>
                Supported deeplink patterns
              </Typography>
              {DEEPLINK_PATTERNS.map(({ label, schema, description }, i) => (
                <Box
                  key={label}
                  sx={{
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: i < DEEPLINK_PATTERNS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 0.25 }}>
                    {label}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontFamily: "monospace", fontSize: "0.68rem", opacity: 0.85, mb: 0.5 }}
                  >
                    {schema}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.65, display: "block" }}>
                    {description}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 0.5, pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 0.25 }}>
                  Network
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ fontFamily: "monospace", fontSize: "0.68rem", opacity: 0.85, mb: 0.5 }}
                >
                  /preprod/…  ·  /preview/…  ·  ?network=preprod  ·  ?network=preview
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.65, display: "block" }}>
                  Optionally scope to a testnet. Mainnet is used by default.
                </Typography>
              </Box>
            </Popover>
            <a
              href={import.meta.env.VITE_GITHUB_URL}
              style={{ marginLeft: "0", marginTop: "1rem" }}
            >
              <IconButton sx={{ color: theme.palette.text.primary }}>
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
