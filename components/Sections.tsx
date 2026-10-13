"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLang } from "./LangProvider";
import { pizzas, hours, fmt } from "@/lib/i18n";
import { useOpenNow } from "./useOpenNow";

/* ---------- manifesto: words light up as you scroll ---------- */
export function Manifesto() {
  const { t } = useLang();
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        el.style.setProperty("--p", String(p));
        const words = el.querySelectorAll<HTMLElement>(".w");
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("lit", i < lit));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [t.manifesto]);
  return (
    <section className="manifesto">
      <p ref={ref} className="wrap manifesto-text">
        {t.manifesto.split(" ").map((w, i) => (
          <span key={`${w}-${i}`} className="w">{w} </span>
        ))}
      </p>
    </section>
  );
}

/* ---------- menu: editorial grid with filter ---------- */
export function Menu() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<"all" | "rossa" | "bianca" | "vegan">("all");
  const tabs: ["all" | "rossa" | "bianca" | "vegan", string][] = [
    ["all", t.menu.all], ["rossa", t.menu.rossa], ["bianca", t.menu.bianca], ["vegan", t.menu.vegan],
  ];
  const featured = pizzas[0];
  const rest = pizzas.slice(1);
  const show = (k: string) => filter === "all" || filter === k;

  return (
    <section className="menu section" id="meny">
      <div className="wrap">
        <header className="menu-head reveal">
          <div>
            <p className="eyebrow">{t.menu.kicker}</p>
            <h2>{t.menu.title}</h2>
          </div>
          <p className="menu-lead">{t.menu.lead}</p>
        </header>

        <div className="menu-tabs reveal" role="tablist" aria-label={t.menu.title}>
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
              {label}
              <small>{k === "all" ? pizzas.length : pizzas.filter((p) => p.kind === k).length}</small>
            </button>
          ))}
        </div>

        <article className={`menu-feature reveal${show(featured.kind) ? "" : " dim"}`}>
          <div className="mf-img">
            <img src={featured.img} alt={featured.name} loading="lazy" width={1100} height={733} />
          </div>
          <div className="mf-body">
            {featured.tag && <span className="pizza-tag">{featured.tag[lang]}</span>}
            <h3>{featured.name}</h3>
            <p>{featured.desc[lang]}</p>
            <div className="mf-foot">
              <span className="mf-price">{featured.price}<small> {t.menu.kr}</small></span>
              <a href="#boka" className="btn btn-red">{t.nav.book}</a>
            </div>
          </div>
        </article>

        <div className="menu-grid">
          {rest.map((p, i) => (
            <article key={p.id} className={`dish reveal${show(p.kind) ? "" : " dim"}`} style={{ "--i": i } as CSSProperties}>
              <div className="dish-img">
                <img src={p.img} alt={p.name} loading="lazy" width={1100} height={733} />
                {p.tag && <span className="pizza-tag">{p.tag[lang]}</span>}
              </div>
              <div className="dish-line">
                <h3>{p.name}</h3>
                <i aria-hidden />
                <span className="dish-price">{p.price}<small> {t.menu.kr}</small></span>
              </div>
              <p>{p.desc[lang]}</p>
              <span className={`pizza-kind ${p.kind}`}>{t.menu[p.kind]}</span>
            </article>
          ))}
        </div>

        <p className="menu-note reveal">{t.menu.note}</p>
      </div>
    </section>
  );
}

/* ---------- craft: ingredient bento ---------- */
const CRAFT_IMG = ["/img/i-dough.webp", "/img/i-tomato.webp", "/img/i-mozzarella.webp", "/img/i-basil.webp", "/img/i-oil.webp", "/img/i-fire.webp"];
export function Craft() {
  const { t } = useLang();
  return (
    <section className="craft section" id="hantverket">
      <div className="wrap">
        <header className="sec-head reveal">
          <p className="eyebrow">{t.craft.kicker}</p>
          <h2>{t.craft.title}</h2>
        </header>
        <div className="bento">
          {t.craft.items.map((it, i) => (
            <figure key={it.name} className={`tile t${i} reveal`} style={{ "--i": i } as CSSProperties}>
              <img src={CRAFT_IMG[i]} alt={it.name} loading="lazy" />
              <figcaption>
                <span className="tile-n">0{i + 1}</span>
                <b>{it.name}</b>
                <small>{it.note}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- story with parallax photos and counting stats ---------- */
function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Story() {
  const { t } = useLang();
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current!;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        el.style.setProperty("--py", String(Math.min(1.2, Math.max(-0.2, p))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section className="story section" id="om-oss">
      <div className="wrap story-grid" ref={wrap}>
        <div className="story-photos">
          <div className="sp sp1 reveal-clip"><img src="/img/s-pizzaiolo.webp" alt="Pizzaiolo skär en nygräddad pizza" loading="lazy" /></div>
          <div className="sp sp2 reveal-clip"><img src="/img/s-oven.webp" alt="Vedeldad stenugn" loading="lazy" /></div>
          <div className="sp sp3 reveal-clip"><img src="/img/s-balls.webp" alt="Degbollar som jäser" loading="lazy" /></div>
        </div>
        <div className="story-copy reveal">
          <p className="eyebrow">{t.story.kicker}</p>
          <h2>{t.story.title}</h2>
          <p>{t.story.p1}</p>
          <p>{t.story.p2}</p>
        </div>
      </div>
      <div className="wrap stats">
        {t.story.stats.map(([n, suf, l]) => (
          <div key={l} className="stat">
            <b><Count to={n} suffix={suf} /></b>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- visit: full-bleed room photo + hours ---------- */
export function Visit() {
  const { t } = useLang();
  const s = useOpenNow();
  return (
    <section className="visit" id="hitta">
      <div className="visit-photo" aria-hidden><img src="/img/room.webp" alt="" loading="lazy" /></div>
      <div className="wrap visit-grid">
        <div className="hours-card reveal">
          <p className="eyebrow">{t.visit.kicker}</p>
          <h2>{t.visit.hours}</h2>
          {s.ready && (
            <p className={`status big ${s.open ? "is-open" : "is-closed"}`}>
              <i />
              {s.open ? t.open : s.next ? `${t.closed} · ${t.opensAt} ${fmt(s.next)}` : t.closed}
            </p>
          )}
          <ul className="hours">
            {t.visit.days.map((d, i) => {
              const h = hours[i];
              return (
                <li key={d} className={s.day === i ? "today" : ""}>
                  <span>{d}{s.day === i && <em>{t.visit.today}</em>}</span>
                  <span>{h ? `${fmt(h[0])}–${fmt(h[1])}` : t.visit.closedDay}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="visit-info reveal">
          <h2>{t.visit.title}</h2>
          <dl>
            <div><dt>{t.visit.address}</dt><dd>{t.visit.addressText}</dd></div>
            <div><dt>{t.visit.phone}</dt><dd><a href="tel:+46310000000">031-00 00 00</a></dd></div>
            <div><dt>{t.visit.takeaway}</dt><dd>{t.visit.takeawayText}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------- booking ---------- */
export function Booking() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  return (
    <section className="booking section" id="boka">
      <div className="booking-bg" aria-hidden><img src="/img/oven-room.webp" alt="" loading="lazy" /></div>
      <div className="wrap booking-inner">
        <div className="booking-copy reveal">
          <p className="eyebrow">{t.book.kicker}</p>
          <h2>{t.book.title}</h2>
          <p>{t.book.lead}</p>
        </div>
        <form className="booking-form reveal" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          {sent ? (
            <div className="thanks"><span className="tick">✓</span><p>{t.book.thanks}</p></div>
          ) : (
            <>
              <label>{t.book.name}<input required name="name" autoComplete="name" /></label>
              <div className="row">
                <label>{t.book.guests}
                  <select name="guests" defaultValue="2">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}</select>
                </label>
                <label>{t.book.date}<input required type="date" name="date" /></label>
                <label>{t.book.time}
                  <select name="time" defaultValue="19:00">
                    {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
              </div>
              <button className="btn btn-red" type="submit">{t.book.submit}</button>
              <small className="demo-note">{t.book.demo}</small>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <img src="/img/emblem-sm.webp" alt="" width={64} height={62} loading="lazy" />
          <p>Pizzeria <i>dell&apos;Anima</i><small>{t.footer.made}</small></p>
        </div>
        <p className="footer-small">© 2026 Pizzeria dell&apos;Anima · {t.footer.photos} · <a href="https://swegbg.com" target="_blank" rel="noreferrer">{t.footer.by}</a></p>
      </div>
    </footer>
  );
}
