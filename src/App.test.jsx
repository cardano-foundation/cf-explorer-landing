import { describe, it, expect } from "vitest";
import { clearPreferencesForUnknownLink, getPreferredExplorer } from "./App.jsx";
import DeepLinkResolver from "./common/DeepLinkResolver.jsx";

const make = (path) => new DeepLinkResolver(path, new URLSearchParams());

const explorers = {
  cExplorer: {
    isDeepLink: true,
    supportedDeepLinks: ["asset", "pool"],
    networks: ["preprod", "preview"],
  },
};

describe("saved explorer preference", () => {
  it("does not redirect malformed asset or pool links", () => {
    for (const path of [
      "/asset/asset17q7r59zlc3dgw0venc80pdv566q6yguw03f0d9",
      "/asset/abc",
      "/pool/pool1invalid",
      "/pool/abc",
    ]) {
      expect(getPreferredExplorer(make(path), explorers, "cExplorer")).toBeNull();
    }
  });

  it("uses the preference for valid IDs on a supported network", () => {
    const subject = "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235484f534b59";
    expect(getPreferredExplorer(make(`/preprod/asset/${subject}`), explorers, "cExplorer")).toBe(explorers.cExplorer);
    expect(getPreferredExplorer(make("/pool/0f292fcaa02b8b2f9b3c8f9fd8e0bb21abedb692a6d5058df3ef2735"), explorers, "cExplorer")).toBe(explorers.cExplorer);
  });

  it("preserves saved preferences for malformed IDs", () => {
    const storage = {
      explorer_pref_asset_mainnet: "cExplorer",
      explorer_pref_transaction_mainnet: "cardanoScan",
      removeItem(key) { delete this[key]; },
    };
    clearPreferencesForUnknownLink(make("/asset/abc"), storage);
    clearPreferencesForUnknownLink(make("/pool/pool1invalid"), storage);
    expect(storage.explorer_pref_asset_mainnet).toBe("cExplorer");
    expect(storage.explorer_pref_transaction_mainnet).toBe("cardanoScan");

    clearPreferencesForUnknownLink(make("/unknown"), storage);
    expect(storage.explorer_pref_asset_mainnet).toBeUndefined();
    expect(storage.explorer_pref_transaction_mainnet).toBeUndefined();
  });
});
