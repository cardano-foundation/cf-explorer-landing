import React from "react";
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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ContentSection = styled("section")`
  margin-top: 40px;
`;

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
  const acceptedDeepLinks = ["transaction", "block", "epoch", "address"];
  const query = useQuery();
  const path = useLocation().pathname.split("/").reverse()[0];
  const isDeepLink = acceptedDeepLinks.includes(path);
  const deepLinkResolver = new DeepLinkResolver(path, query);

  const listOfExplorers = {
    cExplorer: {
      name: "Cexplorer.io",
      description:
        "Most featured explorer on Cardano network since Incentivised Testnet ages.",
      image: cExplorerLogo,
      url: deepLinkResolver.getCExplorerLink("https://cexplorer.io/"),
      isDeepLink: true,
    },
    cardanoScan: {
      name: "Cardano Scan",
      description:
        "A combination of block explorer and pool tool, uses it's own implementation of db-sync.",
      url: deepLinkResolver.getCardanoScanLink("https://cardanoscan.io/"),
      image: cardanoScanLogo,
      isDeepLink: true,
    },
    poolPM: {
      name: "Pool PM",
      description:
        "Block explorer that brought out a new, refreshing concept to visualize transactions.",
      url: "https://pool.pm/",
      image: poolPmLogo,
      isDeepLink: false,
    },
    eUTxO: {
      name: "eUTxO",
      description: "Visual blockchain explorer for Cardano.",
      url: "https://eutxo.org/",
      image: eutxoLogo,
      isDeepLink: false,
    },
    adaStat: {
      name: "AdaStat",
      description:
        "The browser, inconspicuous at first glance, offers a great many statistics and insights.",
      url: "https://adastat.net/",
      image: adaStatLogo,
      isDeepLink: false,
    },
    explorer: {
      name: "Explorer (Beta)",
      description:
        "A Cardano explorer built by Cardano Foundation, currently under development",
      url: deepLinkResolver.getCFBetaExplorerLink(
        "https://beta.explorer.cardano.org/en/"
      ),
      image: betaExplorer,
      isDeepLink: true,
    },
    poolTool: {
      name: "PoolTool",
      description:
        "One of the most feature-rich, unbiased pool tools. Also offers a native app.",
      url: "https://pooltool.io/",
      image: poolTool,
      isDeepLink: false,
    },
  };

  const selectedExplorer =
    listOfExplorers[path] || listOfExplorers[query.get("section")];

  const explorerCards = Object.entries(listOfExplorers).map(
    ([key, explorer]) => (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <CardLink
          href={`${explorer.url}${query.get("value") || ""}`}
          target="_blank"
        >
          <StyledCard
            sx={{
              opacity: isDeepLink && !explorer.isDeepLink ? 0.5 : 1,
              boxShadow: isDeepLink && !explorer.isDeepLink ? 0 : 4,
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
                <Chip
                  color={!explorer.isDeepLink ? "default" : "success"}
                  icon={<LinkIcon />}
                  label={
                    !explorer.isDeepLink
                      ? "link not available"
                      : "link available"
                  }
                  size="small"
                  variant={!explorer.isDeepLink ? "outlined" : ""}
                />
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
    <>
      <Header />
      <ContentSection>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {isDeepLink && (
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
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
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
    </>
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
