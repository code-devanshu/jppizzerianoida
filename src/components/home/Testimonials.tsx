"use client";

import { useEffect, useRef } from "react";
import { Arrow, Quote } from "@/components/zine/icons";
import { reviews as quotes } from "@/data/reviews";


export function Testimonials() {
  const track = useRef<HTMLDivElement>(null);
  const nudge = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0;
    let raf = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const third = el.scrollWidth / 3;
      if (!paused.current && !reduce) x -= 42 * dt;
      const step = nudge.current * 0.12;
      x += step;
      nudge.current -= step;
      // content is tripled, so wrapping by one third is seamless
      if (x <= -third) x += third;
      if (x > 0) x -= third;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const looped = [...quotes, ...quotes, ...quotes];

  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto mb-10 flex max-w-[1600px] items-end justify-between px-6 sm:px-10">
        <div>
          <h2 className="display text-[clamp(3.2rem,8vw,7.5rem)]">Eaters say!</h2>
          <p className="script mt-1 text-2xl text-accent">4.8 ★ on Google · Sector 104</p>
        </div>
        <div className="flex gap-3">
          {(["left", "right"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d === "left" ? "Previous" : "Next"}
              onClick={() => (nudge.current += d === "left" ? 360 : -360)}
              className="grid size-14 place-items-center rounded-full border-2 border-ink transition duration-300 active:scale-90 hover:bg-ink hover:text-paper"
            >
              <Arrow dir={d} className="size-6" />
            </button>
          ))}
        </div>
      </div>
      <div onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
        <div ref={track} className="flex w-max gap-5 will-change-transform">
          {looped.map((q, i) => (
            <figure key={i} aria-hidden={i >= quotes.length} className="relative flex h-72 w-[min(80vw,380px)] shrink-0 flex-col justify-between rounded-3xl border-2 border-ink p-7">
              <span className="absolute left-4 top-4 size-2.5 rounded-full bg-ink" />
              <span className="absolute right-4 top-4 size-2.5 rounded-full bg-ink" />
              <Quote className="mt-4 size-10 text-accent" />
              <blockquote className="display text-[1.55rem] leading-[1.02]">{q.t}</blockquote>
              <figcaption className="script text-xl">{q.h}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
