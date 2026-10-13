"use client";
import { useEffect, useState } from "react";
import { hours } from "@/lib/i18n";

/** Weekday (Mon=0) and minutes since midnight in Europe/Stockholm. */
export function stockholmNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Stockholm", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  const min = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
  return { day, min };
}

export function useOpenNow() {
  const [state, setState] = useState<{ ready: boolean; open: boolean; day: number; next?: number }>({ ready: false, open: false, day: -1 });
  useEffect(() => {
    const tick = () => {
      const { day, min } = stockholmNow();
      const h = hours[day];
      const open = !!h && min >= h[0] && min < h[1];
      const next = h && min < h[0] ? h[0] : undefined;
      setState({ ready: true, open, day, next });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return state;
}
