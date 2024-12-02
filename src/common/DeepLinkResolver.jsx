import React from "react";

const screens = Object.freeze({
  transaction: 'transaction',
  epoch: 'epoch',
  block: 'block',
})

class DeepLinkResolver {
  acceptedDeepLinks = ["transaction", "block", "epoch", "address", "tx"];


  constructor(path, query) {
    // handling two different options (example for transaction): /tx?id=1234 or /tx/1234
    let pathSplit = path.split("/");
    if(pathSplit[0].length === 0) {
        pathSplit.shift();
    }
    this.mode = pathSplit[0] === "tx" ? "transaction" : pathSplit[0];

    // if the path is /tx?id=1234, we need to split the path and get the id from the query
    // if the path is /tx/1234, we need to split the path and get the id from the path
    if(pathSplit.length > 1) {
      this.query = new Map();
      switch (this.mode) {
        case "epoch":
          this.query.set("number", pathSplit[1]);
          break;
        case "block":
          this.query.set("id", pathSplit[1]);
          break;
        case "transaction":
          this.query.set("id", pathSplit[1]);
          break;
        case "address":
          this.query.set("address", pathSplit[1]);
          break;
      }
    } else {
      this.query = query;
    }

  }

  getCExplorerLink (baseLink) {
    var link = baseLink;
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
    var link = baseLink;
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
}

export default DeepLinkResolver;