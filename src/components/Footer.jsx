// src/components/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "100px",
        overflow: "hidden",
        background: "#303846",
        marginTop: 4,
      }}
    >
      <Box sx={{ margin: 2 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: "#fff", justifyContent: 'center' }}
        >
          &copy;Cardano 2024. 
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
