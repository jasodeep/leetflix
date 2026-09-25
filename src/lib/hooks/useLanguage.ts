"use client";

import { useCallback, useSyncExternalStore } from "react";

import { LANGUAGES, type Language } from "@/lib/types";

const KEY = "leetflix:lang";
const EVENT = "leetflix:lang-change";
const DEFAULT: Language = "python";

const isLanguage = (v: unknown): v is Language => LANGUAGES.includes(v as Language);

const read = (): Language => {
  if (typeof window === "undefined") return DEFAULT;
  const v = window.localStorage.getItem(KEY);
  return isLanguage(v) ? v : DEFAULT;
};

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
};

/**
 * Site-wide Python/Go preference, persisted and synchronised across every
 * code block and the player without a context provider.
 */
export function useLanguage(): [Language, (lang: Language) => void] {
  const lang = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const setLang = useCallback((next: Language) => {
    window.localStorage.setItem(KEY, next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [lang, setLang];
}
