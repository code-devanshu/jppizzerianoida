"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { images } from "@/data/images";

const steps = [
  { eyebrow: "01 / The Cart", title: "Started small", body: "JP Pizzeria began as a wood-fired pizza cart in Sector 76, run by Ashish Guglani. Word spread through food vloggers and neighbours who found the hidden gem.", cap: "where it began", img: images.pestoSwirl, tone: "bg-butter" },
  { eyebrow: "02 / The Dough", title: "48 hours to rise", body: "Sourdough made with 00 flour and cold-fermented for 48 hours, so the crust turns out airy, light and easy to digest.", cap: "shaped by hand", img: images.charredCrust, tone: "bg-toffee" },
  { eyebrow: "03 / The Sauce & Fire", title: "Scratch-made, wood-fired", body: "No canned sauces, ever. Everything is made from scratch, then fired in a wood oven until the crust blisters and leopard-spots.", cap: "left in the flame", img: images.oven, tone: "bg-blush" },
  { eyebrow: "04 / The Café", title: "A seat at the table", body: "On 7 July 2026 we opened our first dine-in café in Sector 104. Come for the Margherita, stay for the homely vibe.", cap: "open Tue to Sun", img: images.cafeGarden, tone: "bg-accent-soft" },
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function StoryCarousel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      const tr = track.current;
      if (!el || !tr) return;
      const r = el.getBoundingClientRect();
      const next = clamp(-r.top / (r.height - window.innerHeight));
      const max = Math.max(0, tr.scrollWidth - window.innerWidth);
      tr.style.transform = `translate3d(${-next * max}px,0,0)`;
      setP(next);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = Math.min(steps.length - 1, Math.round(p * (steps.length - 1)));

  return (
    <section ref={section} className="relative h-[420svh]" aria-label="Our story">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mb-8 flex items-end justify-between px-6 sm:px-10">
          <div>
            <h2 className="display text-[clamp(3.5rem,9vw,8rem)]">Our story</h2>
            <div className="mt-4 flex gap-2" aria-hidden>
              {steps.map((_, i) => {
                const w = i === 0 ? 1 : clamp(p * (steps.length - 1) - (i - 1));
                return (
                  <span key={i} className="h-1 w-12 overflow-hidden rounded-full bg-ink/15">
                    <span className="block h-full bg-accent" style={{ width: `${w * 100}%` }} />
                  </span>
                );
              })}
            </div>
          </div>
          <p className="display text-3xl tabular-nums tracking-normal" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </p>
        </div>

        <div ref={track} className="flex w-max gap-6 px-6 will-change-transform sm:px-10">
          {steps.map((s) => (
            <article key={s.eyebrow} className="grid h-[56svh] w-[min(88vw,1080px)] shrink-0 grid-cols-1 overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/10 md:grid-cols-2">
              <div className="relative min-h-0">
                <Image src={s.img} alt="" fill sizes="(min-width:768px) 540px, 88vw" className="object-cover" />
              </div>
              <div className={`flex flex-col justify-between p-6 sm:p-10 ${s.tone}`}>
                <span className="text-xs font-medium uppercase tracking-[0.18em]">{s.eyebrow}</span>
                <div>
                  <h3 className="display text-[clamp(2.5rem,5vw,4.5rem)]">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-snug sm:text-base">{s.body}</p>
                </div>
                <span className="script text-2xl italic text-accent">{s.cap}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
