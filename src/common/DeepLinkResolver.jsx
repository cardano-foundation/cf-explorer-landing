import { bech32 } from "bech32";
import blake from "blakejs";
import React from "react";

const normalizeAssetSubject = (value) => {
  if (!value) return null;
  // Reject spaces and other junk early; subject is hex (optional dotted policy.name).
  if (/[\s_]/.test(value) || /[^0-9a-fA-F.]/.test(value)) return null;
  const parts = value.split(".");
  if (parts.length > 2) return null;
  const subject = parts.join("");
  if (parts.length === 2 && !/^[0-9a-fA-F]{56}$/.test(parts[0])) return null;
  if (!/^[0-9a-fA-F]{56,120}$/.test(subject) || subject.length % 2 !== 0) return null;
  return subject.toLowerCase();
};

const parsePoolId = (value) => {
  if (!value) return null;
  if (/\s/.test(value)) return null;
  try {
    let bytes;
    if (/^[0-9a-fA-F]{56}$/.test(value)) {
      bytes = Uint8Array.from(value.match(/.{2}/g), (byte) => parseInt(byte, 16));
    } else {
      if (value.length !== 56) return null;
      const decoded = bech32.decode(value);
      if (decoded.prefix !== "pool") return null;
      bytes = Uint8Array.from(bech32.fromWords(decoded.words));
      if (bytes.length !== 28) return null;
    }
    return {
      hex: Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""),
      bech32: bech32.encode("pool", bech32.toWords(bytes)),
    };
  } catch {
    return null;
  }
};

// Positive integer string for epoch / block numbers (no signs, spaces, or junk).
const isBlockOrEpochNumber = (value) => typeof value === "string" && /^\d+$/.test(value);

// Cardano tx hashes are blake2b-256 = 64 hex chars.
const isTransactionHash = (value) => typeof value === "string" && /^[0-9a-fA-F]{64}$/.test(value);

// Shelley-era bech32 addresses / reward accounts. Limit >90 for long enterprise addresses.
const isCardanoAddress = (value) => {
  if (!value || /\s/.test(value)) return false;
  try {
    const decoded = bech32.decode(value, 120);
    return ["addr", "addr_test", "stake", "stake_test"].includes(decoded.prefix);
  } catch {
    return false;
  }
};

// CIP-129 gov action: gov_action1… bech32, or 33-byte hex (32-byte tx hash + 1-byte index).
const isGovernanceActionId = (value) => {
  if (!value || /\s/.test(value)) return false;
  if (/^[0-9a-fA-F]{66}$/.test(value)) return true;
  try {
    const decoded = bech32.decode(value, 120);
    if (decoded.prefix !== "gov_action") return false;
    const bytes = Uint8Array.from(bech32.fromWords(decoded.words));
    return bytes.length === 33;
  } catch {
    return false;
  }
};

const isDrepId = (value) => {
  if (!value || /\s/.test(value)) return false;
  try {
    const decoded = bech32.decode(value, 120);
    return decoded.prefix === "drep" || decoded.prefix === "drep_script";
  } catch {
    return false;
  }
};

const screens = Object.freeze({
  transaction: 'transaction',
  epoch: 'epoch',
  block: 'block',
})

class DeepLinkResolver {
  acceptedDeepLinks = ["transaction", "block", "epoch", "address", "tx", "governance-action", "drep", "asset", "pool"];
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
      case "asset":
        if (this.getAssetSubject()) link += `asset/${this.getAssetSubject()}`;
        break;
      case "pool":
        if (this.getPoolId()) link += `pool/${this.getPoolId().bech32}`;
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
      case "asset":
        if (this.getAssetSubject()) link += `token/${this.getAssetSubject()}`;
        break;
      case "pool":
        if (this.getPoolId()) link += `pool/${this.getPoolId().hex}`;
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
      case "asset":
        if (this.getAssetSubject()) link += `tokens/${this.getAssetSubject()}`;
        break;
      case "pool":
        if (this.getPoolId()) link += `pools/${this.getPoolId().bech32}`;
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

  getPoolPmLink(baseLink) {
    const subject = this.getAssetSubject();
    if (!subject) return baseLink;
    const bytes = Uint8Array.from(subject.match(/.{2}/g), (byte) => parseInt(byte, 16));
    const fingerprint = blake.blake2b(bytes, null, 20);
    return `${baseLink}${bech32.encode("asset", bech32.toWords(fingerprint))}`;
  }

  getPoolToolLink(baseLink) {
    const pool = this.getPoolId();
    return pool ? `${baseLink}pool/${pool.hex}` : baseLink;
  }

  getAssetSubject() {
    return this.mode === "asset" ? normalizeAssetSubject(this.query.get("id")) : null;
  }

  getPoolId() {
    return this.mode === "pool" ? parsePoolId(this.query.get("id")) : null;
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
          try {
            const words = bech32.fromWords(bech32.decode(value).words);
            return words.map(word => word.toString(16).padStart(2, "0")).join("");
          } catch {
            return null;
          }
        } else {
          return value;
        }
      case "drep":
        // DReps are forwarded as-is (bech32 drep1...); the explorers that expose a
        // DRep page resolve the bech32 id directly.
        return this.query.get("drep");
      case "asset":
        return this.getAssetSubject();
      case "pool":
        return this.getPoolId()?.bech32 ?? null;
    }
  }

  isCorrectPathVariable() {
    switch (this.mode) {
      case "epoch":
        return isBlockOrEpochNumber(this.query.get("number"));
      case "block":
        return isBlockOrEpochNumber(this.query.get("id"));
      case "transaction":
        return isTransactionHash(this.query.get("id"));
      case "address":
        return isCardanoAddress(this.query.get("address"));
      case "governance-action":
        return isGovernanceActionId(this.query.get("governance-action") ?? this.query.get("id"));
      case "drep":
        return isDrepId(this.query.get("drep"));
      case "asset":
        return this.getAssetSubject() !== null;
      case "pool":
        return this.getPoolId() !== null;
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
      case "asset":
      case "pool":
        return "id";
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
      case "asset":
        return "asset";
      case "pool":
        return "stake pool";
    }
  }

  // Recognized type and a format-valid id (lengths, prefixes, charset). Soft 404 otherwise.
  isKnownDeeplink() {
    return this.isRecognizedDeeplinkType() && this.isCorrectPathVariable();
  }

  isRecognizedDeeplinkType() {
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
