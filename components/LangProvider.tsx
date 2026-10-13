"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Lang, type Dict } from "@/lib/i18n";

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx>({ lang: "sv", t: dict.sv as Dict, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sv");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("anima-lang");
      if (saved === "en" || saved === "sv") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("anima-lang", l); } catch {}
  };

  return <LangCtx.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
