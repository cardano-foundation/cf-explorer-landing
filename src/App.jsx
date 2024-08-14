import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CardanoExplorer = () => {
  const query = useQuery();
  const path = useLocation().pathname.replace("/", "");

  const explorers = {
    cardanoScan: {
      name: "Cardano Scan",
      description:
        "A combination of block explorer and pool tool, uses it&epos;s own implementation of db-sync.",
      baseLink: "https://cardanoscan.io/",
      image: "src/assets/cardano-scan.png",
    },
    poolPM: {
      name: "Pool PM",
      description:
        "Block explorer that brought out a new, refreshing concept to visualize transactions.",
      baseLink: "https://pool.pm/",
      image: "src/assets/pool-pm.png",
    },
    eUTxO: {
      name: "eUTxO",
      description: "Visual blockchain explorer for Cardano.",
      baseLink: "https://eutxo.org/",
      image: "src/assets/eutxo.png",
    },
    adaStat: {
      name: "AdaStat",
      description:
        "The browser, inconspicuous at first glance, offers a great many statistics and insights.",
      baseLink: "https://adastat.net/",
      image: "src/assets/adastat.png",
    },
    explorer: {
      name: "Explorer (Beta)",
      description:
        "A Cardano explorer built by Cardano Foundation, currently under development",
      baseLink: "https://beta.explorer.cardano.org/en/",
      image: "src/assets/beta-explorer.png",
    },
  };

  const selectedExplorer = explorers[path] || explorers[query.get("section")];

  const explorerCards = Object.entries(explorers).map(([key, explorer]) => (
    <Grid item xs={12} sm={6} md={4} key={key}>
      <Card
        sx={{
          maxWidth: 345,
          margin: 1,
          borderRadius: 4,
          overflow: "hidden",
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
          <Typography variant="h5" component="div">
            {explorer.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {explorer.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            component={Link}
            to={`${explorer.baseLink}${query.get("value") || ""}`}
            size="small"
          >
            Continue
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ));

  return (
    <Container maxWidth="lg" style={{ marginTop: "10px" }}>
      <Typography variant="h3" component="h4" gutterBottom textAlign={'center'}>
        Cardano Explorers
      </Typography>
      <Grid container spacing={3}>
        {selectedExplorer ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {selectedExplorer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedExplorer.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`${selectedExplorer.baseLink}${query.get("value") || ""}`}
                  size="small"
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          explorerCards
        )}
      </Grid>
    </Container>
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
