/** Default browser / Matomo title for the home and network-only paths. */
export const HOME_TITLE = "Cardano Explorers";

/**
 * Matomo soft-404 page title (Behaviour > Pages Titles).
 * @see https://matomo.org/faq/how-to/faq_60/
 */
export function buildMatomo404Title(pathname, search, referrer) {
  return (
    "404/URL = " +
    encodeURIComponent((pathname || "") + (search || "")) +
    " /From = " +
    encodeURIComponent(referrer || "")
  );
}

/**
 * Type-only titles for valid deeplinks; Matomo 404 title for unknown or invalid paths.
 * IDs are never put in the title (keeps Matomo cardinality low and avoids junk titles).
 */
export function resolveDocumentTitle(resolver, { pathname, search, referrer }) {
  if (!resolver.isDeepLink(pathname)) {
    return HOME_TITLE;
  }
  if (resolver.isKnownDeeplink()) {
    return `Explore this Cardano ${resolver.getHumanReadableMode()}`;
  }
  return buildMatomo404Title(pathname, search, referrer);
}

/** Sets document.title and records one Matomo page view with that title. */
export function applyDocumentTitleAndTrack(title) {
  const doc = globalThis.document;
  if (doc) {
    doc.title = title;
  }
  // Matomo installs window._paq; in browsers window === globalThis.
  const paq = globalThis._paq ?? globalThis.window?._paq;
  if (!paq) return;
  paq.push(["setDocumentTitle", title]);
  paq.push(["trackPageView"]);
}
