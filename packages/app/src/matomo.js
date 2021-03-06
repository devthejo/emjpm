import cookie from "js-cookie";
import Router from "next/router";

function getJWTPayloadFormLocalStorageIdToken() {
  const token = cookie.get("token");
  if (!token) return { type: null, username: null };
  const [, payloadPart = ""] = token.split(".");
  // prevent some token decoding exceptions
  // "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
  try {
    return JSON.parse(atob(payloadPart) || "{}");
  } catch (error) {
    /* eslint-disable no-console */
    console.log("Error decoding JWT", error);
    /* eslint-enable no-console */
    return {};
  }
}

export function initMatomo() {
  window._paq = window._paq || [];
  let previousPath = "";

  /**
   * for intial loading we use the location.pathname
   * as the first url visited.
   * Once user navigate accross the site,
   * we rely on Router.pathname
   */
  matopush(["setCustomUrl", location.pathname]);
  matopush(["trackPageView"]);
  previousPath = location.pathname;

  Router.events.on("routeChangeComplete", (path) => {
    // We use only the part of the url without the querystring to ensure piwik is happy
    // It seems that piwiki doesn't track well page with querystring
    const [pathname] = path.split("?");
    if (previousPath === pathname) {
      return;
    }

    // In order to ensure that the page title had been updated,
    // we delayed pushing the tracking to the next tick.
    setTimeout(() => {
      const { q, source } = Router.query;
      if (previousPath) {
        matopush(["setReferrerUrl", `${previousPath}`]);
      }
      matopush(["setCustomUrl", pathname]);
      matopush(["setDocumentTitle", document.title]);
      matopush(["deleteCustomVariables", "page"]);
      matopush(["setGenerationTimeMs", 0]);
      if (/^\/recherche/.test(pathname)) {
        matopush(["trackSiteSearch", q, source]);
      } else {
        matopush(["trackPageView"]);
      }
      matopush(["enableLinkTracking"]);
      previousPath = pathname;
    }, 0);
  });
}

export const trackUser = () => {
  const { username, type } = getJWTPayloadFormLocalStorageIdToken();
  username && matopush(["setUserId", username]);
  type && matopush(["setCustomVariable", 1, "type", type, "visit"]);
};

export function matopush(args) {
  window._paq.push(args);
}
