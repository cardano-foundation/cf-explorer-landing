// src/components/Footer.jsx
import React from "react";
import { Box, Grid } from "@mui/material";
import styled from "@emotion/styled";

export const FooterLink = styled("a")`
  display: inline;
  cursor: pointer;
  color: #ebedf0;
  line-height: 2;
  outline-width: 0.5rem;
  text-decoration: none;
  box-sizing: border-box;
  transition: color 0.1s ease-in-out; /* Corrected transition */

  &:hover {
    color: #6684ce;
    text-decoration: underline;
  }
`;

export const FooterLinksTitle = styled("div")`
  display: inline;
  color: #ebedf0;
  line-height: 2;
  outline-width: 0.5rem;
  text-decoration: none;
  box-sizing: border-box;
  font-weight: 700;
`;

export const Copyright = styled("div")`
  text-align: center;
  font-size: 12px;
`;

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        background: "#303846",
        position: "relative",
        color: "#ebedf0",
        fontSize: "14px",
      }}
    >
      <Grid container spacing={2} direction={"column"}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            direction={{xs: "column", sm: "row"}}
            justifyContent="space-around"
            alignItems="space-around"
          >
            <Grid item sm={1}></Grid>
            <Grid item xs={"auto"}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems={{xs: "center", sm: "left"}}
                sx={{ mt: 2 }}
              >
                <Grid item sx={{ mb: 2 }}>
                  <FooterLinksTitle>Support</FooterLinksTitle>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href = "https://cardano.org/brand-assets/")
                    }
                  >
                    Brand Assets
                  </FooterLink>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href = "https://cardanofoundation.org/contact")
                    }
                  >
                    Contact
                  </FooterLink>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={"auto"}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems={{xs: "center", sm: "left"}}
                sx={{ mt: 2 }}
              >
                <Grid item sx={{ mb: 2 }}>
                  <FooterLinksTitle>Legal</FooterLinksTitle>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href =
                        "https://cardanofoundation.org/en/terms-and-conditions")
                    }
                  >
                    Terms & Conditions
                  </FooterLink>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href =
                        "https://cardanofoundation.org/en/privacy")
                    }
                  >
                    Privacy Policy
                  </FooterLink>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={"auto"}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems={{xs: "center", sm: "left"}}
                sx={{ mt: 2 }}
              >
                <Grid item sx={{ mb: 2 }}>
                  <FooterLinksTitle>More</FooterLinksTitle>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href = "https://cardanofoundation.org")
                    }
                  >
                    News
                  </FooterLink>
                </Grid>
                <Grid item>
                  <FooterLink
                    onClick={() =>
                      (location.href =
                        "https://developers.cardano.org/docs/portal-contribute/")
                    }
                  >
                    Contribute
                  </FooterLink>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={1}></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{m: 2}}>
          <Copyright>® Cardano</Copyright>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
