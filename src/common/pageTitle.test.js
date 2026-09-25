import { describe, it, expect, beforeEach, afterEach } from "vitest";
import DeepLinkResolver from "./DeepLinkResolver.jsx";
import {
  HOME_TITLE,
  buildMatomo404Title,
  resolveDocumentTitle,
  applyDocumentTitleAndTrack,
} from "./pageTitle.js";

const make = (path, qs = "") => new DeepLinkResolver(path, new URLSearchParams(qs));

const GOV_BECH = "gov_action1jxne7hynfd7frcczwumd2eggps4kvy0msjztz9t0mutpy870ksgqqp6vp3p";
const DREP = "drep1ygqzg3ed7rdqeg3343jw0fptqzc3lqtk3rvnnmgq64rj85sxd4sr4";
const TX = "a".repeat(64);
const POOL_BECH = "pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy";

describe("resolveDocumentTitle", () => {
  it("uses the home title for / and network-only paths", () => {
    expect(resolveDocumentTitle(make("/"), { pathname: "/", search: "", referrer: "" })).toBe(HOME_TITLE);
    expect(resolveDocumentTitle(make("/preprod"), { pathname: "/preprod", search: "", referrer: "" })).toBe(HOME_TITLE);
  });

  it("uses type-only titles for valid deeplinks (no raw id)", () => {
    expect(resolveDocumentTitle(make(`/governance-action/${GOV_BECH}`), {
      pathname: `/governance-action/${GOV_BECH}`,
      search: "",
      referrer: "",
    })).toBe("Explore this Cardano governance action");

    expect(resolveDocumentTitle(make(`/drep/${DREP}`), {
      pathname: `/drep/${DREP}`,
      search: "",
      referrer: "",
    })).toBe("Explore this Cardano DRep");

    expect(resolveDocumentTitle(make(`/transaction/${TX}`), {
      pathname: `/transaction/${TX}`,
      search: "",
      referrer: "",
    })).toBe("Explore this Cardano transaction");

    expect(resolveDocumentTitle(make(`/pool/${POOL_BECH}`), {
      pathname: `/pool/${POOL_BECH}`,
      search: "",
      referrer: "",
    })).toBe("Explore this Cardano stake pool");

    expect(resolveDocumentTitle(make("/epoch/42"), {
      pathname: "/epoch/42",
      search: "",
      referrer: "",
    })).toBe("Explore this Cardano epoch");
  });

  it("uses the Matomo 404 title for unknown paths and invalid ids", () => {
    const unknown = resolveDocumentTitle(make("/does-not-exist"), {
      pathname: "/does-not-exist",
      search: "?x=1",
      referrer: "https://example.com/",
    });
    expect(unknown).toBe(buildMatomo404Title("/does-not-exist", "?x=1", "https://example.com/"));
    expect(unknown.startsWith("404/URL = ")).toBe(true);

    const badTx = resolveDocumentTitle(make("/transaction/deadbeef"), {
      pathname: "/transaction/deadbeef",
      search: "",
      referrer: "",
    });
    expect(badTx).toBe(buildMatomo404Title("/transaction/deadbeef", "", ""));
  });
});

describe("applyDocumentTitleAndTrack", () => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;

  beforeEach(() => {
    globalThis.document = { title: "before" };
    globalThis.window = { _paq: [] };
  });

  afterEach(() => {
    globalThis.document = previousDocument;
    globalThis.window = previousWindow;
  });

  it("sets document.title and pushes setDocumentTitle then trackPageView", () => {
    applyDocumentTitleAndTrack("Explore this Cardano transaction");
    expect(globalThis.document.title).toBe("Explore this Cardano transaction");
    expect(globalThis.window._paq).toEqual([
      ["setDocumentTitle", "Explore this Cardano transaction"],
      ["trackPageView"],
    ]);
  });

  it("still sets document.title when Matomo is absent", () => {
    delete globalThis.window._paq;
    applyDocumentTitleAndTrack(HOME_TITLE);
    expect(globalThis.document.title).toBe(HOME_TITLE);
  });
});
