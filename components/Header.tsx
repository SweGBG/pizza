"use client";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { useOpenNow } from "./useOpenNow";
import { fmt } from "@/lib/i18n";

export function Header() {
  const { t, lang, setLang } = useLang();
  const status = useOpenNow();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links: [string, string][] = [
    ["#meny", t.nav.menu],
    ["#hantverket", t.nav.craft],
    ["#om-oss", t.nav.story],
    ["#hitta", t.nav.visit],
  ];

  return (
    <header className={`hdr${scrolled ? " scrolled" : ""}${open ? " menu-open" : ""}`}>
      <a href="#top" className="hdr-brand" aria-label="Pizzeria dell'Anima">
        <img src="/img/emblem-sm.webp" alt="" width={44} height={43} />
        <span>
          <b>Pizzeria</b> <i>dell&apos;Anima</i>
        </span>
      </a>

      <nav className="hdr-nav" aria-label="Huvudmeny">
        {links.map(([href, label], i) => (
          <a key={href} href={href} style={{ ["--i" as string]: i }} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a href="#boka" className="btn btn-red hdr-book" style={{ ["--i" as string]: 4 }} onClick={() => setOpen(false)}>
          {t.nav.book}
        </a>
      </nav>

      <div className="hdr-tools">
        {status.ready && (
          <span className={`status ${status.open ? "is-open" : "is-closed"}`}>
            <i />
            {status.open ? t.open : status.next ? `${t.opensAt} ${fmt(status.next)}` : t.closed}
          </span>
        )}
        <button className="lang" onClick={() => setLang(lang === "sv" ? "en" : "sv")} aria-label="Byt språk / Change language">
          <span className={lang === "sv" ? "on" : ""}>SV</span>
          <span className={lang === "en" ? "on" : ""}>EN</span>
        </button>
        <button className="burger" aria-label="Meny" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  );
}
