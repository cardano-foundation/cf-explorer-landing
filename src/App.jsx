import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Alert,
  styled,
  Stack,
  Chip,
} from "@mui/material";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import DeepLinkResolver from "src/common/DeepLinkResolver.jsx";
import cExplorerLogo from "/assets/cexplorer.png";
import cardanoScanLogo from "/assets/cardano-scan.png";
import poolPmLogo from "/assets/pool-pm.png";
import eutxoLogo from "/assets/eutxo.png";
import adaStatLogo from "/assets/adastat.png";
import betaExplorer from "/assets/beta-explorer.png";
import poolTool from "/assets/pool-tool.png";
import LinkIcon from "@mui/icons-material/Link";

import { ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "src/common/style/theme";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ContentSection = styled("section")(({ theme }) => ({
  paddingBottom: "40px",
  backgroundColor: theme.palette.background.default,
}));

export const CardLink = styled("a")`
  display: contents;
  cursor: pointer;
`;

const StyledCard = styled(Card)(({ theme }) => ({
  width: 345,
  height: 300,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  transition: "transform 0.5s ease-in-out",

  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const CardanoExplorer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = localStorage.getItem("darkMode");
    if (darkModePreference) {
      setIsDarkMode(darkModePreference === "true");
    }


  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const acceptedDeepLinks = ["transaction", "block", "epoch", "address"];
  const query = useQuery();
  const path = useLocation().pathname.split("/").reverse()[0];
  const isKnownDeepLink = acceptedDeepLinks.includes(path);
  const isDeepLink = path.length > 0;
  const deepLinkResolver = new DeepLinkResolver(path, query);

  const listOfExplorers = {
    cExplorer: {
      name: "Cexplorer.io",
      description:
        "Ideal for those who need comprehensive data on Cardano's blockchain thanks to its robust analytical tools.",
      image: cExplorerLogo,
      url: deepLinkResolver.getCExplorerLink("https://cexplorer.io/"),
      isDeepLink: true,
    },
    cardanoScan: {
      name: "Cardano Scan",
      description:
        "Essential for users seeking detailed and reliable data on a feature rich explorer.",
      url: deepLinkResolver.getCardanoScanLink("https://cardanoscan.io/"),
      image: cardanoScanLogo,
      isDeepLink: true,
    },
    poolPM: {
      name: "Pool PM",
      description:
        "Essential for NFT enthusiasts and creators who need to monitor and showcase their assets. Dynamic tool for visualizing NFTs. ",
      url: "https://pool.pm/",
      image: poolPmLogo,
      isDeepLink: false,
    },
    eUTxO: {
      name: "eUTxO",
      description: "Interactive and engaging way to visualize Cardano's block content through it's innovative and gamified interface.",
      url: "https://eutxo.org/",
      image: eutxoLogo,
      isDeepLink: false,
    },
    adaStat: {
      name: "AdaStat",
      description:
        "Ideal for analysts and researcher who need to advanced statistical analyses and network monitoring.",
      url: "https://adastat.net/",
      image: adaStatLogo,
      isDeepLink: false,
    },
    explorer: {
      name: "Explorer (Beta)",
      description:
        "Focused on enterprises and policymakers. Currently under development, built by Cardano Foundation.",
      url: deepLinkResolver.getCFBetaExplorerLink(
        "https://beta.explorer.cardano.org/en/"
      ),
      image: betaExplorer,
      isDeepLink: true,
    },
    poolTool: {
      name: "PoolTool",
      description:
        "Essential for those who need to make informed staking decisions. Provides data on the performance of pools. ",
      url: "https://pooltool.io/",
      image: poolTool,
      isDeepLink: false,
    },
  };

  // sorting
  const sortedExplorers = Object.entries(listOfExplorers).sort((a,b) => 0.5 - Math.random());
  // having the deeplink explorers first
  // sortedExplorers.sort(([, a], [, b]) => b.isDeepLink - a.isDeepLink);

  const selectedExplorer =
    listOfExplorers[path] || listOfExplorers[query.get("section")];

  const explorerCards = sortedExplorers.map(
    ([key, explorer]) => (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <CardLink
          href={`${explorer.url}${query.get("value") || ""}`}
          target="_blank"
        >
          <StyledCard
            sx={{
              opacity: isKnownDeepLink && !explorer.isDeepLink ? 0.5 : 1,
              boxShadow: isKnownDeepLink && !explorer.isDeepLink ? 0 : 4,
            }}
          >
            <CardMedia
              component="img"
              height="150"
              image={explorer.image}
              alt={explorer.name}
              sx={{
                width: "100%",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                position: "relative",
              }}
            />
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" component="div">
                  {explorer.name}
                </Typography>
                {isKnownDeepLink && (<Chip
                  color={!explorer.isDeepLink ? "default" : "success"}
                  icon={<LinkIcon />}
                  label={
                    !explorer.isDeepLink
                      ? "link not available"
                      : "link available"
                  }
                  size="small"
                  variant={!explorer.isDeepLink ? "outlined" : ""}
                />)}
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {explorer.description}
              </Typography>
            </CardContent>
          </StyledCard>
        </CardLink>
      </Grid>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <ContentSection>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {isKnownDeepLink && deepLinkResolver.isCorrectPathVariable() &&  (
              <Grid item xs={12}>
                <Alert
                  severity={"info"}
                  sx={{
                    borderRadius: "16px",
                  }}
                >
                  You will be forwarded to {path} {deepLinkResolver.getValue()}{" "}
                  after choosing your favorite Explorer
                </Alert>
              </Grid>
            )}
            {isDeepLink && !isKnownDeepLink && (
                <Grid item xs={12}>
                  <Alert
                      severity={"error"}
                      sx={{
                        borderRadius: "16px",
                      }}
                  >
                    DeepLink "{path}" not matching any of the correct paths: {acceptedDeepLinks.join(", ")}.
                    If this is a bug, please create an issue in Github.
                  </Alert>
                </Grid>
            )}
            {isDeepLink && isKnownDeepLink && !deepLinkResolver.isCorrectPathVariable() && (
                <Grid item xs={12}>
                  <Alert
                      severity={"error"}
                      sx={{
                        borderRadius: "16px",
                      }}
                  >
                    You need to set "{deepLinkResolver.getCorrectPathVariable()}" for Deeplink {path}.
                    If this is a bug, please create an issue in Github.
                  </Alert>
                </Grid>
                )
            }
            <Grid item xs={12}>
              <Typography variant="h6" color={theme.palette.text.primary} gutterBottom>
                Select the Explorer of your choice
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                spacing={3}
                sx={{
                  display: { xs: "grid", sm: "flex" },
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedExplorer ? (
                  <Grid item xs={12}>
                    <CardLink
                      href={`${selectedExplorer.baseLink}${
                        query.get("value") || ""
                      }`}
                      target="_blank"
                    >
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            {selectedExplorer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedExplorer.description}
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </CardLink>
                  </Grid>
                ) : (
                  explorerCards
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </ContentSection>
      <Footer />
    </ThemeProvider>
  );
};

function App() {
  return (
    <div>
      <CardanoExplorer />
    </div>
  );
}

export default App;
