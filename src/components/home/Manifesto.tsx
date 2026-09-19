"use client";

import { useEffect, useRef, useState } from "react";
import { CurvedArrow } from "@/components/zine/icons";
import { Scallop } from "@/components/zine/Scallop";

const words = ["pure", "Fresh", "Honest"] as const;

function LineArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="100" cy="100" r="88" />
      <circle cx="100" cy="100" r="70" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="100" y1="100" x2={+(100 + 70 * Math.cos((a * Math.PI) / 180)).toFixed(2)} y2={+(100 + 70 * Math.sin((a * Math.PI) / 180)).toFixed(2)} />
      ))}
      <circle cx="100" cy="100" r="8" />
    </svg>
  );
}

function SliceArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
      <path d="M100 190 20 40a120 120 0 0 1 160 0Z" />
      <path d="M32 58a105 105 0 0 1 136 0" />
      <circle cx="90" cy="80" r="10" />
      <circle cx="118" cy="98" r="8" />
      <circle cx="98" cy="128" r="9" />
    </svg>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - r.top) / (vh + r.height);
      // Snap instantly at thresholds rather than easing.
      setIdx(p < 0.5 ? 0 : p < 0.66 ? 1 : 2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-paper">
      <Scallop />
      <section ref={ref} data-invert className="relative -mt-px overflow-hidden bg-ink py-28 text-paper sm:py-40">
        <LineArt className="pointer-events-none absolute -left-24 top-10 size-[420px] text-paper/[0.07]" />
        <SliceArt className="pointer-events-none absolute -right-16 bottom-0 size-[480px] rotate-12 text-paper/[0.07]" />
        <div className="relative mx-auto max-w-[1300px] px-6 sm:px-10">
          <h2 className="display text-[clamp(3rem,8.4vw,8rem)] leading-[0.95]">
            Real Neapolitan pizza. Naturally leavened, wonderfully{" "}
            <span className="relative inline-block rounded-xl bg-gold px-4 text-ink" aria-live="polite">
              <span className="inline-block min-w-[3ch] text-center">{words[idx]}</span>
            </span>
            , straight from our wood-fired oven in Noida.
          </h2>
          <div className="mt-12 flex items-start gap-3 sm:ml-[52%]">
            <CurvedArrow className="mt-2 h-14 w-24 -scale-x-100 rotate-[200deg] text-paper/80" />
            <p className="script max-w-xs text-3xl leading-tight text-paper/90">that&apos;s why people love to eat it!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
