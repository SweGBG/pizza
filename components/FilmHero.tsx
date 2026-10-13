"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";

const VIDEO = "/video/pizzeria-scene.mp4";
const POSTER = "/video/pizzeria-poster.webp";
const FRAMES_MANIFEST = "/video/m/manifest.json";
/** Real photos used until/if the film is missing — one per chapter. */
const PHOTOS = ["/img/dough-start.webp", "/img/i-tomato.webp", "/img/i-fire.webp", "/img/pizza-end.webp"];

/** Scroll ranges (0–1) for the intro and the four chapters: [in, full, hold, out] */
const INTRO: [number, number, number, number] = [-1, 0, 0.05, 0.12];
const CH: [number, number, number, number][] = [
  [0.1, 0.14, 0.2, 0.25],
  [0.29, 0.33, 0.45, 0.5],
  [0.54, 0.58, 0.7, 0.75],
  [0.84, 0.9, 2, 2],
];
/** Chapter spans used for the chapter navigator */
const SPAN: [number, number][] = [[0, 0.27], [0.27, 0.52], [0.52, 0.8], [0.8, 1]];

type Mode = "video" | "frames" | "photos";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const vis = (p: number, [a, b, c, d]: [number, number, number, number]) =>
  p < a || p > d ? 0 : p < b ? (p - a) / (b - a) : p > c ? 1 - (p - c) / (d - c) : 1;

export function FilmHero() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photos = useRef<(HTMLImageElement | null)[]>([]);
  const intro = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLElement | null)[]>([]);
  const [mode, setMode] = useState<Mode | null>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let off = false;
    (async () => {
      const phone = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
      const exists = async (u: string) => {
        try { return (await fetch(u, { method: "HEAD" })).ok; } catch { return false; }
      };
      let m: Mode = "photos";
      if (phone && (await exists(FRAMES_MANIFEST))) m = "frames";
      else if (!phone && (await exists(VIDEO))) m = "video";
      else if (await exists(FRAMES_MANIFEST)) m = "frames";
      if (!off) setMode(m);
    })();
    return () => { off = true; };
  }, []);

  useEffect(() => {
    if (!mode) return;
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0, cur = 0, raf = 0, lastSeek = 0, lastFrame = -1, lastActive = -2;
    let frames: HTMLImageElement[] = [];
    let ready: boolean[] = [];
    const cv = canvas.current;
    const ctx = cv?.getContext("2d") ?? null;

    const fit = () => {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      lastFrame = -1;
    };
    if (mode === "frames") {
      fetch(FRAMES_MANIFEST)
        .then((r) => r.json())
        .then((mf: { count: number; pattern: string }) => {
          ready = new Array(mf.count).fill(false);
          frames = Array.from({ length: mf.count }, (_, i) => {
            const img = new Image();
            img.src = mf.pattern.replace("%03d", String(i + 1).padStart(3, "0"));
            img.decode().then(() => { ready[i] = true; lastFrame = -1; }).catch(() => {});
            return img;
          });
        })
        .catch(() => setMode("photos"));
    }
    fit();
    window.addEventListener("resize", fit);

    const drawFrame = (p: number) => {
      if (!ctx || !cv || !frames.length) return;
      const want = Math.round(p * (frames.length - 1));
      if (want === lastFrame) return;
      let best = -1;
      for (let d = 0; d < frames.length; d++) {
        if (ready[want - d]) { best = want - d; break; }
        if (ready[want + d]) { best = want + d; break; }
      }
      if (best < 0) return;
      const img = frames[best];
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      lastFrame = want;
    };

    const tick = (now: number) => {
      cur += (target - cur) * (reduce ? 1 : 0.1);
      const p = clamp(cur);

      // the film slowly settles: starts slightly zoomed, ends at rest
      if (media.current) media.current.style.transform = `scale(${1.1 - 0.1 * p})`;

      if (intro.current) {
        const o = vis(p, INTRO);
        intro.current.style.opacity = String(o);
        intro.current.style.transform = `translate3d(0, ${(1 - o) * -40}px, 0) scale(${0.94 + o * 0.06})`;
        intro.current.style.filter = o < 1 ? `blur(${(1 - o) * 10}px)` : "none";
        intro.current.style.visibility = o > 0.01 ? "visible" : "hidden";
      }
      layers.current.forEach((l, i) => {
        if (!l) return;
        const o = vis(p, CH[i]);
        l.style.opacity = String(o);
        l.style.transform = `translate3d(0, ${(1 - o) * 30}px, 0)`;
        l.style.visibility = o > 0.01 ? "visible" : "hidden";
      });
      segs.current.forEach((s, i) => {
        if (!s) return;
        const [a, b] = SPAN[i];
        s.style.setProperty("--f", String(clamp((p - a) / (b - a))));
      });
      const act = p < 0.08 ? -1 : SPAN.findIndex(([a, b]) => p >= a && p < b + (b === 1 ? 0.01 : 0));
      if (act !== lastActive) { lastActive = act; setActive(act); }

      if (mode === "video" && video.current) {
        const v = video.current;
        if (v.duration) {
          const want = p * (v.duration - 0.05);
          if (Math.abs(v.currentTime - want) > 1 / 30 && now - lastSeek > 16) {
            v.currentTime = want;
            lastSeek = now;
          }
        }
      } else if (mode === "frames") {
        drawFrame(p);
      } else {
        // photo fallback: crossfade between chapter photos with a slow push-in
        photos.current.forEach((img, i) => {
          if (!img) return;
          const [a, b] = SPAN[i];
          const fadeIn = i === 0 ? 1 : clamp((p - (a - 0.04)) / 0.08);
          const local = clamp((p - a) / (b - a));
          img.style.opacity = String(fadeIn);
          img.style.transform = `scale(${1.02 + local * 0.12})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      target = clamp(-r.top / (r.height - window.innerHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, [mode]);

  const jump = (i: number) => {
    const el = root.current;
    if (!el) return;
    const p = CH[i][1] + 0.02;
    window.scrollTo({ top: el.offsetTop + p * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section className="film" id="top" ref={root} aria-label="Pizzeria dell'Anima">
      <div className="film-stage">
        <div className="film-media" ref={media}>
          {mode === "video" && (
            <video ref={video} className="film-video" src={VIDEO} poster={POSTER} muted playsInline preload="auto" />
          )}
          <canvas ref={canvas} className="film-canvas" hidden={mode !== "frames"} />
          {(mode === "photos" || mode === null) && (
            <div className="film-photos">
              {PHOTOS.map((src, i) => (
                <img key={src} ref={(n) => { photos.current[i] = n; }} src={src} alt="" style={{ opacity: i === 0 ? 1 : 0 }} />
              ))}
            </div>
          )}
        </div>
        <div className="film-shade" aria-hidden />

        <div className="film-intro" ref={intro}>
          <img className="film-emblem" src="/img/emblem.webp" alt="Pizzeria dell'Anima" width={719} height={695} />
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1 className="film-title">
            <span className="ft1">{t.hero.title1}</span>
            <span className="ft2">{t.hero.title2}</span>
          </h1>
          <p className="film-lead">{t.hero.lead}</p>
          <div className="film-ctas">
            <a href="#meny" className="btn btn-red">{t.hero.cta1}</a>
            <a href="#boka" className="btn btn-line">{t.hero.cta2}</a>
          </div>
          <span className="film-scroll" aria-hidden><i />{t.hero.scroll}</span>
        </div>

        {t.chapters.map((c, i) => (
          <div key={c.n} className={`chapter${i === 3 ? " final" : ""}`} ref={(n) => { layers.current[i] = n; }}>
            <span className="chapter-num" aria-hidden>{c.n}</span>
            <p className="eyebrow">{c.n} — {c.name}</p>
            <h2>{c.h}</h2>
            <p className="chapter-text">{c.p}</p>
            {i === 3 && (
              <div className="film-ctas">
                <a href="#boka" className="btn btn-red">{t.book.title.replace("?", "")}</a>
                <a href="#meny" className="btn btn-line">{t.hero.cta1}</a>
              </div>
            )}
          </div>
        ))}

        <nav className="chapter-nav" aria-label="Kapitel">
          {t.chapters.map((c, i) => (
            <button key={c.n} className={active === i ? "on" : ""} onClick={() => jump(i)} ref={(n) => { segs.current[i] = n; }}>
              <span className="seg"><i /></span>
              <span className="lbl"><b>{c.n}</b> {c.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
