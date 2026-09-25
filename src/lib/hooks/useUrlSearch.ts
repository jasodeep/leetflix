"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "leetflix:url-change";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
};

/**
 * `window.location.search` as React state. The URL is the single source of
 * truth, so filtered views are shareable on a static host, and hydration is
 * safe because the server snapshot is always the empty query string.
 */
export function useUrlSearch(): [URLSearchParams, (next: URLSearchParams) => void] {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const set = useCallback((next: URLSearchParams) => {
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [new URLSearchParams(search), set];
}
