"use client";
import { useEffect } from "react";

/** Seeded LCG so server and client render identical particle positions. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Pauses CSS animations in sections that are off-screen, and reveals .reveal elements once. */
export function Effects() {
  useEffect(() => {
    const pause = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)),
      { rootMargin: "120px 0px" }
    );
    document.querySelectorAll("[data-anim]").forEach((el) => pause.observe(el));

    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            reveal.unobserve(e.target);
          }
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    const watch = () => document.querySelectorAll(".reveal:not(.in), .reveal-clip:not(.in), .reveal-up:not(.in)").forEach((el) => reveal.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      pause.disconnect();
      reveal.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

/** Splits text into words that materialize (blur → sharp) one by one. */
export function Materialize({ text, base = 0, step = 0.06 }: { text: string; base?: number; step?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="mw" style={{ ["--d" as string]: `${base + i * step}s` }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}
