"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PizzaIcon } from "./icons";

const DURATION = 1800;
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** One odometer column. It holds still, then slides to the next digit as the column below it wraps. */
function Digit({ value, place }: { value: number; place: number }) {
  const scaled = value / 10 ** place;
  const whole = Math.floor(scaled);
  const ramp = Math.min(1, Math.max(0, (scaled - whole - 0.7) / 0.3));
  const pos = (whole % 10) + ramp;
  return (
    <span className="inline-block h-[1em] overflow-hidden align-top leading-none">
      <span className="flex flex-col will-change-transform" style={{ transform: `translateY(${-pos}em)` }}>
        {STRIP.map((d, i) => (
          <span key={i} className="block h-[1em] leading-none">{d}</span>
        ))}
      </span>
    </span>
  );
}

export function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef(0);
  const lastPath = useRef<string | null>(null);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setLeaving(false);
    setVisible(true);
    startRef.current = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 500 : DURATION;
    const tick = (now: number) => {
      const t = Math.min(1, (now - (startRef.current ?? now)) / total);
      // ease-in-out so it lingers a touch on the way up
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setValue(eased * 100);
      setPct(Math.round(eased * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        window.setTimeout(() => {
          setVisible(false);
          startRef.current = null;
        }, 650);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  // First load, and any pathname change that no link click already started (back/forward).
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (startRef.current === null || !visible) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to route changes
  }, [pathname, run]);

  // Internal link clicks cover the screen immediately so the cut is never visible.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      run();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [run]);

  // Reset on unmount too, so React Strict Mode's dev remount restarts the count instead of freezing at 0.
  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      lastPath.current = null;
      startRef.current = null;
    },
    [],
  );

  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      role="status"
      aria-label={`Loading ${pct}%`}
      className="fixed inset-0 z-[100] bg-ink text-paper transition-transform duration-[650ms] ease-[cubic-bezier(.4,0,.2,1)]"
      style={{ transform: leaving ? "translateY(-100%)" : "none" }}
    >
      <div className="absolute inset-0 grid place-items-center">
        <PizzaIcon fill={pct} className="size-28 text-paper sm:size-36" />
      </div>
      <div className="display absolute bottom-6 left-6 text-[clamp(5rem,16vw,12rem)] tabular-nums text-paper sm:bottom-8 sm:left-10">
        <span className="inline-flex" aria-hidden>
          <Digit value={value} place={2} />
          <Digit value={value} place={1} />
          <Digit value={value} place={0} />
        </span>
        <span className="align-top text-[0.35em] text-accent">%</span>
      </div>
    </div>
  );
}
