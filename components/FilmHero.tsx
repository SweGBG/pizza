"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";
import { crintro, nearestFrame, onCrintro, wantFrame, PHONE_QUERY } from "@/lib/crintro";

/* The CRiNTRO Loader (lib/crintro.ts) loads the film while the intro plays: desktop gets the mp4
 * as a local blob, phones get a streamed image sequence. If neither loads, chapter photos crossfade. */
const POSTER = "/video/pizzeria-poster.webp";
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
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [active, setActive] = useState(-1);

  // Media mode comes from the CRiNTRO Loader: phone → image sequence, desktop → video, otherwise photos.
  useEffect(() => {
    const store = crintro();
    const sync = () => {
      setMode(store.mode === "frames" ? "frames" : store.mode === "video" ? "video" : store.mode === "failed" ? "photos" : null);
      setVideoSrc(store.videoUrl);
    };
    sync();
    return onCrintro(sync);
  }, []);

  useEffect(() => {
    if (!mode) return;
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones skip the per-frame blur on the intro text: blur is the most expensive thing to animate there.
    const lite = window.matchMedia(PHONE_QUERY).matches;
    let target = 0, cur = 0, raf = 0, lastSeek = 0, lastActive = -2, last = performance.now();
    let lastImg: CanvasImageSource | null = null;
    // Only touch the DOM when a value really changed (saves style recalculation every frame).
    const put = (el: HTMLElement, prop: string, val: string) => {
      const box = el as HTMLElement & { _c?: Record<string, string> };
      box._c ??= {};
      if (box._c[prop] !== val) {
        box._c[prop] = val;
        el.style.setProperty(prop, val);
      }
    };
    const cv = canvas.current;
    const ctx = cv?.getContext("2d") ?? null;

    const fit = () => {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      lastImg = null;
    };
    fit();
    window.addEventListener("resize", fit);

    const drawFrame = (p: number, count: number) => {
      if (!ctx || !cv || !count) return;
      const want = Math.round(p * (count - 1));
      wantFrame(want);
      const img = nearestFrame(want);
      if (!img || img === lastImg) return;
      lastImg = img;
      const s = Math.max(cv.width / img.width, cv.height / img.height);
      const w = img.width * s, h = img.height * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // glide toward the scroll position at the same speed on 60 and 120 Hz screens
      cur += (target - cur) * (reduce ? 1 : 1 - Math.pow(0.9, dt * 60));
      if (Math.abs(target - cur) < 0.00005) cur = target;
      const p = clamp(cur);

      // the film slowly settles: starts slightly zoomed, ends at rest
      if (media.current) put(media.current, "transform", `scale(${(1.1 - 0.1 * p).toFixed(4)})`);

      if (intro.current) {
        const o = +vis(p, INTRO).toFixed(3);
        put(intro.current, "opacity", String(o));
        put(intro.current, "transform", `translate3d(0, ${((1 - o) * -40).toFixed(1)}px, 0) scale(${(0.94 + o * 0.06).toFixed(3)})`);
        if (!lite) put(intro.current, "filter", o < 1 ? `blur(${((1 - o) * 10).toFixed(1)}px)` : "none");
        put(intro.current, "visibility", o > 0.01 ? "visible" : "hidden");
      }
      layers.current.forEach((l, i) => {
        if (!l) return;
        const o = +vis(p, CH[i]).toFixed(3);
        put(l, "opacity", String(o));
        put(l, "transform", `translate3d(0, ${((1 - o) * 30).toFixed(1)}px, 0)`);
        put(l, "visibility", o > 0.01 ? "visible" : "hidden");
      });
      segs.current.forEach((s, i) => {
        if (!s) return;
        const [a, b] = SPAN[i];
        put(s, "--f", clamp((p - a) / (b - a)).toFixed(3));
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
        drawFrame(p, crintro().count);
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
    window.addEventListener("resize", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, [mode, videoSrc]);

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
            <video ref={video} className="film-video" src={videoSrc ?? undefined} poster={POSTER} muted playsInline preload="auto" />
          )}
          <canvas ref={canvas} className="film-canvas" hidden={mode !== "frames"} />
          {(mode === "photos" || mode === null) && (
            <div className="film-photos">
              {/* only the first photo until we know the film can't load: phones shouldn't download all four */}
              {PHOTOS.slice(0, mode === "photos" ? PHOTOS.length : 1).map((src, i) => (
                <img key={src} ref={(n) => { photos.current[i] = n; }} src={src} alt="" style={{ opacity: i === 0 ? 1 : 0 }} />
              ))}
            </div>
          )}
        </div>
        <div className="film-shade" aria-hidden />

        <div className="film-intro" ref={intro} data-crintro-hold>
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
