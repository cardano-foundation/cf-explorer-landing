// src/components/Footer.jsx
import React from "react";
import {Box, Grid} from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "120px",
        overflow: "hidden",
        background: "#303846",
        position: "relative",
        marginTop: '20px',
        left: 0,
        bottom: 0
      }}
    >
        <Grid container spacing={2} style={{color: "white", marginTop: "1px", fontSize: "small"}}>
            <Grid item xs={2}/>
            <Grid item xs={2}>
                <div style={{fontWeight: "bold"}}>Entities</div>
                <div onClick={() => location.href = 'https://cardanofoundation.org'}>Cardano Foundation</div>
                <div onClick={() => location.href = 'https://emurgo.io'}>Emurgo</div>
                <div onClick={() => location.href = 'https://iohk.io'}>Input Output</div>
            </Grid>
            <Grid item xs={2}>
                <div style={{fontWeight: "bold"}}>Support</div>
                <div onClick={() => location.href = 'https://cardano.org/brand-assets/'}>Brand Assets</div>
                <div onClick={() => location.href = 'https://cardanofoundation.org/contact'}>Contact</div>
            </Grid>
            <Grid item xs={2}>
                <div style={{fontWeight: "bold"}}>Legal</div>
                <div onClick={() => location.href = 'https://cardanofoundation.org/en/terms-and-conditions'}>Terms <LaunchIcon fontSize={"inherit"}/></div>
                <div onClick={() => location.href = 'https://cardanofoundation.org/en/privacy'}>Privacy Policy <LaunchIcon fontSize={"inherit"}/></div>
            </Grid>
            <Grid item xs={2}>
                <div style={{fontWeight: "bold"}}>More</div>
                <div onClick={() => location.href = 'https://cardanofoundation.org'}>News</div>
                <div onClick={() => location.href = 'https://developers.cardano.org/docs/portal-contribute/'}>Contribute</div>
            </Grid>
            <Grid item xs={2}/>
            <Grid item xs={12} style={{textAlign: "center", color: "white", fontSize: "small"}}>
                © 2024 Cardano Foundation. All rights reserved.
            </Grid>
        </Grid>
    </Box>
  );
}

export default Footer;
