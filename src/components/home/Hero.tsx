"use client";

import { useEffect, useRef, useState } from "react";
import { Branch, CurvedArrow } from "@/components/zine/icons";
import { CircleButton } from "@/components/zine/CircleButton";
import { gyroNeedsPermission, requestGyro, useTilt } from "@/components/zine/useTilt";
import { SceneCanvas } from "./SceneCanvas";

const TOAST_KEY = "vf-gyro-toast";

export function Hero() {
  const tilt = useTilt();
  const spin = useRef(0.02);
  const [toast, setToast] = useState(false);
  const [needsGyro, setNeedsGyro] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      if (!gyroNeedsPermission()) return;
      const flag = window.setTimeout(() => setNeedsGyro(true), 0);
      // iOS only accepts the prompt from click/touchend; keep trying until it is granted.
      const ask = async () => {
        if (await requestGyro()) {
          setNeedsGyro(false);
          window.removeEventListener("click", ask);
          window.removeEventListener("touchend", ask);
        }
      };
      window.addEventListener("click", ask);
      window.addEventListener("touchend", ask);
      return () => {
        window.clearTimeout(flag);
        window.removeEventListener("click", ask);
        window.removeEventListener("touchend", ask);
      };
    }
    let seen = false;
    try {
      seen = localStorage.getItem(TOAST_KEY) === "1";
    } catch {}
    if (!seen) {
      const t = window.setTimeout(() => setToast(true), 2600);
      return () => window.clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setToast(false);
    try {
      localStorage.setItem(TOAST_KEY, "1");
    } catch {}
  };

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-24">
      <Branch className="pointer-events-none absolute -right-24 top-[6%] -z-10 h-[95%] rotate-[8deg] text-accent/60 sm:-right-12" />
      <div className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-[1600px] grid-cols-1 items-center gap-4 px-6 pb-10 sm:px-10 lg:grid-cols-[1.1fr_1fr_0.75fr]">
        <div className="relative z-10 self-start lg:pt-6">
          <h1 className="display text-[clamp(4.2rem,11.5vw,10.5rem)]">
            Fire in
            <br />
            every slice.
          </h1>
          <ul className="mt-8 space-y-2 text-lg">
            <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-accent" />48-hour sourdough, cold-fermented</li>
            <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-accent" />Sauces made from scratch</li>
            <li className="flex items-center gap-3"><span className="size-2 rounded-full bg-accent" />Wood-fired, leopard-spotted crust</li>
          </ul>
          <CurvedArrow className="mt-2 hidden h-16 w-28 -rotate-6 text-ink lg:block" />
        </div>

        <div className="relative order-first h-[52svh] lg:order-none lg:h-[80svh]">
          <SceneCanvas controls={{ spin, tilt }} className="absolute inset-[-8%]" />
        </div>

        <div className="relative z-10 max-w-sm space-y-6 lg:justify-self-end">
          <p className="text-lg leading-snug">
            Naples in Noida. A family-run pizzeria turning out Neapolitan pizza from a wood-fired oven: blistered crust, fresh sauce and no shortcuts.
          </p>
          <CircleButton href="/menu">Discover Pizzas</CircleButton>
          <p className="script text-xl text-ink/70">4.8 ★ on Google · Sector 104, Noida</p>
        </div>
      </div>

      {needsGyro && (
        <button
          type="button"
          onClick={async () => setNeedsGyro(!(await requestGyro()))}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-paper shadow-xl active:scale-95"
        >
          Tap to enable gyro tilt
        </button>
      )}

      {toast && (
        <div role="status" className="animate-pop fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-ink px-5 py-3 text-sm text-paper shadow-xl">
          Use mobile to experience gyro tilt
          <button type="button" onClick={dismiss} aria-label="Dismiss" className="grid size-7 place-items-center rounded-md transition active:scale-90 hover:bg-paper/15">
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
