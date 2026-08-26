import { bech32 } from "bech32";
import React from "react";

const screens = Object.freeze({
  transaction: 'transaction',
  epoch: 'epoch',
  block: 'block',
})

class DeepLinkResolver {
  acceptedDeepLinks = ["transaction", "block", "epoch", "address", "tx", "governance-action", "drep"];
  acceptedNetworks = ["preprod", "preview"]; // mainnet is default


  constructor(path, query) {
    // handling two different options (example for transaction): /tx?id=1234 or /tx/1234
    let pathSplit = path.split("/");

    // finding the right index to avoid prefixes like /en/ - we don't support them, so we are ignoring them
    let index = pathSplit.findIndex((item) => {
        return this.acceptedDeepLinks.includes(item);
    });

    this.mode = pathSplit[index] === "tx" ? "transaction" : pathSplit[index];
    // Both forms are supported (example for transaction): /tx?id=1234 and /tx/1234.
    // Start from whatever the query string carries, then fill in the value from the
    // path segment right after the deeplink type. The two are merged rather than
    // treated as alternatives, so unrelated params someone appends to a shared link
    // (tracking parameters, additions from a mail client) cannot hide a path value.
    this.query = new Map(query);
    const pathVariable = this.getCorrectPathVariable();
    const pathValue = pathSplit[index + 1];
    if (pathVariable && pathValue && !this.query.has(pathVariable)) {
      this.query.set(pathVariable, pathValue);
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
        link += `block?search=block_no%3A${this.getValue()}`;
        break;
      case "transaction":
        link += `tx/${this.getValue()}`;
        break;
      case "address":
        link += `address/${this.getValue()}`;
        break;
      case "governance-action":
        link += `gov/action?search=${this.getValue(true)}`;
        break;
      case "drep":
        link += `drep/${this.getValue()}`;
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
        link += `block/${this.getValue()}`;
        break;
      case "transaction":
        link += `transaction/${this.getValue()}`;
        break;
      case "address":
        link += `address/${this.getValue()}`;
        break;
      case "governance-action":
        link += `govAction/${this.getValue()}`;
        break;
      case "drep":
        link += `drep/${this.getValue()}`;
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
      case "governance-action":
        link += `governances/${this.getValue()}`;
        break;
    }
    return link;
  }

  getDrepTalkLink(baseLink) {
    // DRepTalk is a governance-only site: it serves the governance-action and drep
    // types and takes the bech32 form directly. It has a preprod instance at
    // preprod.dreptalk.com (there is no preview), reachable via the same subdomain
    // prefix the other explorers use.
    const networks = { preprod: "preprod." };
    var link = baseLink.replace("https://", "https://" + (networks[this.network] || ""));
    switch (this.mode) {
      case "governance-action":
        link += `t/${this.getValue(true)}`;
        break;
      case "drep":
        link += `dreps/${this.getValue()}`;
        break;
    }
    return link;
  }

  getValue(convert) {
    switch (this.mode) {
      case "epoch":
        return this.query.get("number");
      case "block":
        return this.query.get("id");
      case "transaction":
        return this.query.get("id");
      case "address":
        return this.query.get("address");
      case "governance-action":
        // NOTE: If the argument is provided as a bech32-encoded string, we convert it to hexadecimal because
        // not all explorers handle well gov id as bech32 string, but those who handle gov action handles them
        // fine in hexadecimal/base16.
        // The id can arrive via the documented `id` query param (e.g. ?id=gov_action1...) as well
        // as the `governance-action` key the path form uses. Guard the null so a missing/malformed
        // value never throws (which would blank the whole page).
        const value = this.query.get("governance-action") ?? this.query.get("id") ?? null;
        if (value && value.startsWith(`gov_action1`) && !convert) {
          const words = bech32.fromWords(bech32.decode(value).words);
          return words.map(word => word.toString(16).padStart(2, "0")).join("");
        } else {
          return value;
        }
      case "drep":
        // DReps are forwarded as-is (bech32 drep1...); the explorers that expose a
        // DRep page resolve the bech32 id directly.
        return this.query.get("drep");
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
      case "governance-action":
        return this.query.has("governance-action") || this.query.has("id");
      case "drep":
        return this.query.has("drep");
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
      case "governance-action":
        return "governance-action";
      case "drep":
        return "drep";
    }
  }

  getHumanReadableMode() {
    switch (this.mode) {
      case "epoch":
        return "epoch";
      case "block":
        return "block";
      case "transaction":
        return "transaction";
      case "address":
        return "address";
      case "governance-action":
        return "governance action";
      case "drep":
        return "DRep";
    }
  }

  isKnownDeeplink() {
    return this.acceptedDeepLinks.includes(this.mode);
  }

  canHandleNetwork(networks) {
    return this.network === undefined || this.network === null || networks.includes(this.network);
  }

  // Some explorers only support a subset of deeplink types (e.g. a governance
  // tool that resolves DReps and governance actions but not transactions). Each
  // explorer states the types it supports in its `supportedDeepLinks` list; there
  // is no implicit fallback, so a new opt-in type only lights up where it is listed.
  canHandleMode(supportedDeepLinks) {
    return (supportedDeepLinks ?? []).includes(this.mode);
  }

  isDeepLink(path) {
    const filteredPath = path.replace("/", "");
    return filteredPath.length > 0 && !this.acceptedNetworks.includes(filteredPath);
  }
}

export default DeepLinkResolver;
