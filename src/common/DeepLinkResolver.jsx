import React from "react";

const screens = Object.freeze({
  transaction: 'transaction',
  epoch: 'epoch',
  block: 'block',
})

class DeepLinkResolver {
  acceptedDeepLinks = ["transaction", "block", "epoch", "address", "tx"];
  acceptedNetworks = ["preprod", "preview"]; // mainnet is default


  constructor(path, query) {
    // handling two different options (example for transaction): /tx?id=1234 or /tx/1234
    let pathSplit = path.split("/");

    // finding the right index to avoid prefixes like /en/ - we don't support them, so we are ignoring them
    let index = pathSplit.findIndex((item) => {
        return this.acceptedDeepLinks.includes(item);
    });

    this.mode = pathSplit[index] === "tx" ? "transaction" : pathSplit[index];
    // if the path is /tx?id=1234, we need to split the path and get the id from the query
    // if the path is /tx/1234, we need to split the path and get the id from the path
    if(query.size === 0 || query.size === 1 && query.has("network")) {
      this.query = new Map();
      switch (this.mode) {
        case "epoch":
          this.query.set("number", pathSplit[pathSplit.length - 1]);
          break;
        case "block":
          this.query.set("id", pathSplit[pathSplit.length - 1]);
          break;
        case "transaction":
          this.query.set("id", pathSplit[pathSplit.length - 1]);
          break;
        case "address":
          this.query.set("address", pathSplit[pathSplit.length - 1]);
          break;
        default:
          console.log("Unknown mode: " + this.mode);
      }
    } else {
      this.query = query;
    }
    // Network can be set like ?network=preprod or /preprod/tx?id=1234
    if(query.has("network")) {
      this.network = query.get("network");
    }
    let findIndex = pathSplit.findIndex((item => this.acceptedNetworks.includes(item)));
    if(findIndex !== -1) {
      this.network = pathSplit[findIndex];
    }
  }

  getCExplorerLink (baseLink) {
    const networks = {
      preprod: "preprod.",
      preview: "preview."
    }

    var link = baseLink.replace("https://", "https://" + (networks[this.network] || ""));
    switch (this.mode) {
      case "epoch":
        link += `epoch/${this.getValue()}`;
        break;
      case "block":
        link += `block/${this.getValue()}`;
        break;
      case "transaction":
        link += `tx/${this.getValue()}`;
        break;
      case "address":
        link += `address/${this.getValue()}`;
        break;
    }
    return link;
  }

  getCardanoScanLink(baseLink) {
    const networks = {
      preprod: "preprod.",
      preview: "preview."
    }
    var link = baseLink.replace("https://", "https://" + (networks[this.network] || ""));
    switch (this.mode) {
      case "epoch":
        link += `epoch/${this.getValue()}`;
        break;
      case "block":
        link += `search?filter=blocks&value=/${this.getValue()}`;
        break;
      case "transaction":
        link += `transaction/${this.getValue()}`;
        break;
      case "address":
        link += `address/${this.getValue()}`;
        break;
    }
    return link;
  }

  getAdaStatLink(baseLink) {
    var link = baseLink;
    switch (this.mode) {
      case "epoch":
        link += `epochs/${this.getValue()}`;
        break;
      case "block":
        link += `blocks/${this.getValue()}`;
        break;
      case "transaction":
        link += `transactions/${this.getValue()}`;
        break;
      case "address":
        link += `addresses/${this.getValue()}`;
        break;
    }
    return link;
  }

  getValue() {
    switch (this.mode) {
      case "epoch":
        return this.query.get("number");
      case "block":
        return this.query.get("id");
      case "transaction":
        return this.query.get("id");
      case "address":
        return this.query.get("address");
    }
  }

  isCorrectPathVariable() {
    switch (this.mode) {
      case "epoch":
        return this.query.has("number");
      case "block":
        return this.query.has("id");
      case "transaction":
        return this.query.has("id");
      case "address":
        return this.query.has("address");
    }
  }

  getCorrectPathVariable() {
    switch (this.mode) {
      case "epoch":
        return "number";
      case "block":
        return "id";
      case "transaction":
        return "id";
      case "address":
        return "address";
    }
  }

  isKnownDeeplink() {
    return this.acceptedDeepLinks.includes(this.mode);
  }

  canHandleNetwork(networks) {
    return this.network === undefined || this.network === null || networks.includes(this.network);
  }

  isDeepLink(path) {
    const filteredPath = path.replace("/", "");
    return filteredPath.length > 0 && !this.acceptedNetworks.includes(filteredPath);
  }
}

export default DeepLinkResolver;