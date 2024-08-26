import React from "react";

const screens = Object.freeze({
  transaction: 'transaction',
  epoch: 'epoch',
  block: 'block',
})

class DeepLinkResolver {

  constructor(path, query) {
    this.mode = path.split("/").reverse()[0].replace('.html','');
    this.query = query;
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

  getCFBetaExplorerLink(baseLink) {
    var link = baseLink;
    switch (this.mode) {
      case "epoch":
        link += `epoch/${this.getValue()}`;
        break;
      case "block":
        link += `block/${this.getValue()}`;
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
}

export default DeepLinkResolver;