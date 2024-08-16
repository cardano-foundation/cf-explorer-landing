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
        link += `epoch/${this.query.get("number")}`;
        break;
      case "block":
        link += `block/${this.query.get("id")}`;
        break;
      case "transaction":
        link += `tx/${this.query.get("tx")}`;
        break;
    }
    return link;
  }

  getCardanoScanLink(baseLink) {
    var link = baseLink;
    switch (this.mode) {
      case "epoch":
        link += `epoch/${this.query.get("number")}`;
        break;
      case "block":
        link += `search?filter=blocks&value=/${this.query.get("id")}`;
        break;
      case "transaction":
        link += `transaction/${this.query.get("tx")}`;
        break;
    }
    return link;
  }

  getCFBetaExplorerLink(baseLink) {
    var link = baseLink;
    switch (this.mode) {
      case "epoch":
        link += `epoch/${this.query.get("number")}`;
        break;
      case "block":
        link += `block/${this.query.get("id")}`;
        break;
      case "transaction":
        link += `tx/${this.query.get("tx")}`;
        break;
    }
    return link;
  }
}

export default DeepLinkResolver;