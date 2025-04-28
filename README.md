# Cardano Explorer Landing Page

Cardano Explorer Landing Page, a simple web application showcasing major Cardano blockchain explorers. Built using React, Vite, and Material UI (MUI), this project provides an elegant interface to explore and access various Cardano blockchain explorers.

## Features

- **Responsive Design**: Optimized for different screen sizes with a flexible grid layout.
- **Material UI Components**: Utilizes MUI for a sleek and modern UI.
- **Dynamic Routing**: Captures URL parameters and routes users to specific explorer pages.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)

## Deeplinks - How to use them
This landing page supports DeepLinks to be able to forward to your favorite explorer.
Deeplinks are available for the following endpoints:
- `Epoch` - URL `explorer.cardano.org/epoch?number={EPOCH_NUMBER}` or `explorer.cardano.org/epoch/{EPOCH_NUMBER}`
- `Block` - URL `explorer.cardano.org/block?id={BLOCK_NUMBER}` or `explorer.cardano.org/block/{BLOCK_NUMBER}`
- `Transaction` - URL `explorer.cardano.org/transaction?id={TRANSACTION_ID}` or `explorer.cardano.org/transaction/{TRANSACTION_ID}`
- `Address` - URL `explorer.cardano.org/address?address={ADDRESS}` or `explorer.cardano.org/address/{ADDRESS}`

Additionally, to the above functions it is possible to specify which network to use. The following networks are supported:
- `mainnet` - Default network, no need to specify
- `preprod` - `explorer.cardano.org/?network=preprod` or `explorer.cardano.org/preprod`
- `preview` - `explorer.cardano.org/?network=preview` or `explorer.cardano.org/preview`

A full example for a transaction would be:
`explorer.cardano.org/transaction?id=1234567890&network=preprod`
## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/cardano-foundation/cf-explorer-landing.git
   cd cf-explorer-landing

   ```

2. **Install dependencies:**

   Make sure you have Node.js installed. Then run:

   ```bash
   npm install

   ```

3. **Start the development server:**

   Make sure you have Node.js installed. Then run:

   ```bash
   npm run dev
   ```

Open your browser and navigate to http://localhost:3000 to view the application.

## Project Structure

    cardano-explorer/
    | public/
    |   assets/
    | src/
    |   common/
    |       |── DeepLinkResolver.jsx
    |   components/
    │       ├── Header.jsx
    │       └── Footer.jsx
    │   App.jsx
    │   main.jsx
    │   index.css
    │ index.html
    | jsconfig.json
    | vite.config.js
    | package.json
    | README.md
