import { describe, it, expect } from "vitest";
import DeepLinkResolver from "./DeepLinkResolver.jsx";

// Build a resolver the way App.jsx does: a pathname plus URL search params.
const make = (path, qs = "") => new DeepLinkResolver(path, new URLSearchParams(qs));

// A real governance action id and its base16 form (index byte included). The
// hex was derived independently from the bech32 via the `bech32` lib so this
// test pins the conversion rather than re-deriving it from the same code path.
const GOV_BECH = "gov_action1jxne7hynfd7frcczwumd2eggps4kvy0msjztz9t0mutpy870ksgqqp6vp3p";
const GOV_HEX = "91a79f5c934b7c91e3027736d565080c2b6611fb8484b1156fdf16121fcfb41000";
const DREP = "drep1ygqzg3ed7rdqeg3343jw0fptqzc3lqtk3rvnnmgq64rj85sxd4sr4";

const CEXPLORER = "https://cexplorer.io/";
const CARDANOSCAN = "https://cardanoscan.io/";
const ADASTAT = "https://adastat.net/";

// Exact links every explorer must produce per deeplink type. The pre-`drep`
// rows lock the existing behaviour so the change cannot regress them; the
// `drep` rows cover the new type.
const cases = [
  {
    mode: "epoch",
    path: "/epoch/42",
    cexplorer: "https://cexplorer.io/epoch/42",
    cardanoscan: "https://cardanoscan.io/epoch/42",
    adastat: "https://adastat.net/epochs/42",
  },
  {
    mode: "block",
    path: "/block/12345",
    cexplorer: "https://cexplorer.io/block?search=block_no%3A12345",
    cardanoscan: "https://cardanoscan.io/block/12345",
    adastat: "https://adastat.net/blocks/12345",
  },
  {
    mode: "transaction",
    path: "/transaction/deadbeef",
    cexplorer: "https://cexplorer.io/tx/deadbeef",
    cardanoscan: "https://cardanoscan.io/transaction/deadbeef",
    adastat: "https://adastat.net/transactions/deadbeef",
  },
  {
    mode: "address",
    path: "/address/addr1xyz",
    cexplorer: "https://cexplorer.io/address/addr1xyz",
    cardanoscan: "https://cardanoscan.io/address/addr1xyz",
    adastat: "https://adastat.net/addresses/addr1xyz",
  },
  {
    mode: "governance-action",
    path: `/governance-action/${GOV_BECH}`,
    // cExplorer keeps the bech32 form; the others use the hex form.
    cexplorer: `https://cexplorer.io/gov/action?search=${GOV_BECH}`,
    cardanoscan: `https://cardanoscan.io/govAction/${GOV_HEX}`,
    adastat: `https://adastat.net/governances/${GOV_HEX}`,
  },
  {
    mode: "drep",
    path: `/drep/${DREP}`,
    cexplorer: `https://cexplorer.io/drep/${DREP}`,
    cardanoscan: `https://cardanoscan.io/drep/${DREP}`,
    // AdaStat has no DRep page, so its builder leaves the base link untouched.
    adastat: "https://adastat.net/",
  },
];

describe("link builders per deeplink type", () => {
  for (const c of cases) {
    it(`${c.mode}: builds the exact link for every explorer`, () => {
      const r = make(c.path);
      expect(r.mode).toBe(c.mode);
      expect(r.getCExplorerLink(CEXPLORER)).toBe(c.cexplorer);
      expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(c.cardanoscan);
      expect(r.getAdaStatLink(ADASTAT)).toBe(c.adastat);
    });
  }
});

describe("network prefixing is unchanged and applies to drep", () => {
  it("prefixes preprod for the existing gov-action type", () => {
    const r = make(`/preprod/governance-action/${GOV_BECH}`);
    expect(r.network).toBe("preprod");
    expect(r.getCExplorerLink(CEXPLORER)).toBe(`https://preprod.cexplorer.io/gov/action?search=${GOV_BECH}`);
    expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(`https://preprod.cardanoscan.io/govAction/${GOV_HEX}`);
  });

  it("prefixes preprod for the new drep type", () => {
    const r = make(`/preprod/drep/${DREP}`);
    expect(r.network).toBe("preprod");
    expect(r.getCExplorerLink(CEXPLORER)).toBe(`https://preprod.cexplorer.io/drep/${DREP}`);
    expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(`https://preprod.cardanoscan.io/drep/${DREP}`);
  });

  it("prefixes via ?network=preview too", () => {
    const r = make(`/drep/${DREP}`, "network=preview");
    expect(r.network).toBe("preview");
    expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(`https://preview.cardanoscan.io/drep/${DREP}`);
  });
});

describe("tx alias still normalises to transaction", () => {
  it("maps /tx/<id> to the transaction links", () => {
    const r = make("/tx/deadbeef");
    expect(r.mode).toBe("transaction");
    expect(r.getCardanoScanLink(CARDANOSCAN)).toBe("https://cardanoscan.io/transaction/deadbeef");
  });
});

describe("drep parsing (path and query forms)", () => {
  it("reads the id from the path form", () => {
    const r = make(`/drep/${DREP}`);
    expect(r.getValue()).toBe(DREP);
    expect(r.isCorrectPathVariable()).toBe(true);
  });

  it("reads the id from the query form", () => {
    const r = make("/drep", `drep=${DREP}`);
    expect(r.mode).toBe("drep");
    expect(r.getValue()).toBe(DREP);
    expect(r.isCorrectPathVariable()).toBe(true);
  });

  it("reports a missing variable when the query form lacks the drep param", () => {
    // Query form carrying an unrelated param: the drep id is absent, matching how
    // the other modes flag a missing path variable.
    const r = make("/drep", "foo=bar");
    expect(r.isCorrectPathVariable()).toBe(false);
  });

  it("exposes drep metadata", () => {
    const r = make(`/drep/${DREP}`);
    expect(r.isKnownDeeplink()).toBe(true);
    expect(r.getCorrectPathVariable()).toBe("drep");
    expect(r.getHumanReadableMode()).toBe("DRep");
  });
});

describe("DRepTalk (governance-only explorer)", () => {
  const DREPTALK = "https://dreptalk.com/";

  it("links a governance action to its discussion, keeping bech32", () => {
    const r = make(`/governance-action/${GOV_BECH}`);
    expect(r.getDrepTalkLink(DREPTALK)).toBe(`https://dreptalk.com/t/${GOV_BECH}`);
  });

  it("links a drep to its profile", () => {
    const r = make(`/drep/${DREP}`);
    expect(r.getDrepTalkLink(DREPTALK)).toBe(`https://dreptalk.com/dreps/${DREP}`);
  });

  it("uses the preprod host on preprod (no preview instance)", () => {
    expect(make(`/preprod/governance-action/${GOV_BECH}`).getDrepTalkLink(DREPTALK)).toBe(
      `https://preprod.dreptalk.com/t/${GOV_BECH}`,
    );
    expect(make(`/preprod/drep/${DREP}`).getDrepTalkLink(DREPTALK)).toBe(
      `https://preprod.dreptalk.com/dreps/${DREP}`,
    );
    // mainnet stays on the apex host.
    expect(make(`/drep/${DREP}`).getDrepTalkLink(DREPTALK)).toBe(`https://dreptalk.com/dreps/${DREP}`);
  });

  it("serves nothing for non-governance types", () => {
    for (const path of ["/epoch/42", "/block/12345", "/transaction/deadbeef", "/address/addr1xyz"]) {
      expect(make(path).getDrepTalkLink(DREPTALK)).toBe(DREPTALK);
    }
  });

  it("is only enabled for governance-action and drep", () => {
    const supportedDeepLinks = ["governance-action", "drep"];
    expect(make(`/drep/${DREP}`).canHandleMode(supportedDeepLinks)).toBe(true);
    expect(make(`/governance-action/${GOV_BECH}`).canHandleMode(supportedDeepLinks)).toBe(true);
    expect(make("/transaction/x").canHandleMode(supportedDeepLinks)).toBe(false);
    expect(make("/epoch/42").canHandleMode(supportedDeepLinks)).toBe(false);
  });
});

describe("canHandleMode gates each explorer to exactly its declared types", () => {
  it("supports only the listed deeplink types (AdaStat: classic types, no drep)", () => {
    const adaStat = ["transaction", "block", "epoch", "address", "governance-action"];
    for (const mode of adaStat) {
      const path = mode === "governance-action" ? `/governance-action/${GOV_BECH}` : `/${mode}/x`;
      expect(make(path).canHandleMode(adaStat)).toBe(true);
    }
    expect(make(`/drep/${DREP}`).canHandleMode(adaStat)).toBe(false);
  });

  it("has no implicit fallback: an explorer with no list supports nothing", () => {
    expect(make("/transaction/x").canHandleMode(undefined)).toBe(false);
    expect(make(`/drep/${DREP}`).canHandleMode(undefined)).toBe(false);
  });

  it("gates an explorer to exactly its declared types", () => {
    const full = ["transaction", "block", "epoch", "address", "governance-action", "drep"];
    expect(make(`/drep/${DREP}`).canHandleMode(full)).toBe(true);
    expect(make(`/drep/${DREP}`).canHandleMode(["governance-action"])).toBe(false);
    expect(make("/transaction/x").canHandleMode(["governance-action", "drep"])).toBe(false);
    expect(make("/transaction/x").canHandleMode(full)).toBe(true);
  });
});

describe("governance-action deeplink resolves every documented form without crashing", () => {
  const forms = [
    ["path form", `/governance-action/${GOV_BECH}`, ""],
    ["?id= query form (as documented in the help and README)", "/governance-action", `id=${GOV_BECH}`],
    ["?governance-action= query form", "/governance-action", `governance-action=${GOV_BECH}`],
  ];

  for (const [label, path, qs] of forms) {
    it(`${label}: resolves the id`, () => {
      const r = make(path, qs);
      expect(r.isCorrectPathVariable()).toBe(true);
      // bech32 is kept when convert=true (how cExplorer consumes it); hex otherwise.
      expect(r.getValue(true)).toBe(GOV_BECH);
      expect(r.getValue()).toBe(GOV_HEX);
      expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(`https://cardanoscan.io/govAction/${GOV_HEX}`);
      expect(r.getCExplorerLink(CEXPLORER)).toBe(`https://cexplorer.io/gov/action?search=${GOV_BECH}`);
    });
  }

  it("does not throw when the id is absent (guards the null that blanked the page)", () => {
    const r = make("/governance-action", "foo=bar");
    expect(() => r.getValue()).not.toThrow();
    expect(r.getValue()).toBeNull();
    expect(r.isCorrectPathVariable()).toBe(false);
  });
});

describe("unrelated query params do not break the path form", () => {
  // Mail clients, newsletters and campaign links append their own params to a
  // shared URL. The id sits in the path, so an extra param must not hide it.
  it("keeps the governance action id when a param is appended", () => {
    const r = make(`/governance-action/${GOV_BECH}`, "parameter=bla");
    expect(r.isCorrectPathVariable()).toBe(true);
    expect(r.getValue(true)).toBe(GOV_BECH);
    expect(r.getCardanoScanLink(CARDANOSCAN)).toBe(`https://cardanoscan.io/govAction/${GOV_HEX}`);
  });

  it("keeps the id for every other deeplink type too", () => {
    expect(make("/epoch/42", "utm_source=newsletter").getValue()).toBe("42");
    expect(make("/block/12345", "utm_source=newsletter").getValue()).toBe("12345");
    expect(make("/transaction/deadbeef", "utm_source=newsletter").getValue()).toBe("deadbeef");
    expect(make("/address/addr1xyz", "utm_source=newsletter").getValue()).toBe("addr1xyz");
    expect(make(`/drep/${DREP}`, "utm_source=newsletter").getValue()).toBe(DREP);
  });

  it("still applies the network alongside an unrelated param", () => {
    const r = make(`/preprod/governance-action/${GOV_BECH}`, "parameter=bla");
    expect(r.network).toBe("preprod");
    expect(r.getCExplorerLink(CEXPLORER)).toBe(`https://preprod.cexplorer.io/gov/action?search=${GOV_BECH}`);
  });

  it("lets the query form win when it carries the id itself", () => {
    const r = make("/transaction/frompath", "id=fromquery");
    expect(r.getValue()).toBe("fromquery");
  });
});
