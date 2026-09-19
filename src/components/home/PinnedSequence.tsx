"use client";

import { useEffect, useRef, useState } from "react";
import { CircleButton } from "@/components/zine/CircleButton";
import { useTilt } from "@/components/zine/useTilt";
import { SceneCanvas } from "./SceneCanvas";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** Opacity for a stage active over [a,b] with a soft crossfade edge. */
const window_ = (p: number, a: number, b: number, edge = 0.04) => clamp((p - a) / edge) * clamp((b - p) / edge);

function ScrubWords({ text, p, from, to, className = "" }: { text: string; p: number; from: number; to: number; className?: string }) {
  const words = text.split(" ");
  const local = clamp((p - from) / (to - from));
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const t = clamp(local * (words.length + 3) - i);
        return (
          <span key={i} aria-hidden className="inline-block" style={{ opacity: t, transform: `translateY(${(1 - t) * 0.4}em)` }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

const stats = [
  { from: 0.06, to: 0.28, big: "48", unit: "h", label: "Sourdough ferment" },
  { from: 0.06, to: 0.28, big: "100%", unit: "", label: "Scratch-made sauce" },
  { from: 0.06, to: 0.28, big: "0", unit: "", label: "Canned sauces" },
];

export function PinnedSequence() {
  const section = useRef<HTMLElement>(null);
  const spin = useRef(0);
  const tilt = useTilt();
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const next = clamp(-r.top / (r.height - window.innerHeight));
      spin.current = next;
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

  const frame = String(Math.round(p * 120)).padStart(3, "0");
  const stageA = window_(p, 0, 0.3);
  const stageB = window_(p, 0.3, 0.56);
  const stageC = window_(p, 0.56, 0.8);
  const boxT = clamp((p - 0.8) / 0.2);
  const sceneOpacity = 1 - clamp((p - 0.78) / 0.08);

  return (
    <section ref={section} className="relative h-[560svh]" aria-label="How every pie is made">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        {/* giant text that the box passes in front of */}
        <div
          aria-hidden
          className="display pointer-events-none absolute inset-x-0 top-1/2 z-0 whitespace-nowrap text-[clamp(7rem,26vw,26rem)] text-accent"
          style={{
            opacity: clamp((p - 0.78) / 0.1),
            transform: `translate3d(${(1 - boxT) * 18 - boxT * 22}%, -50%, 0)`,
          }}
        >
          Keep eating..
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[8%] z-10 mx-auto max-w-[1000px]" style={{ opacity: sceneOpacity }}>
          <SceneCanvas controls={{ spin, tilt }} className="size-full" />
        </div>

        {/* stage A: headline + stat badges */}
        <div className="absolute inset-0 z-20 mx-auto flex max-w-[1600px] flex-col justify-between px-6 pb-20 pt-28 sm:px-10" style={{ opacity: stageA, pointerEvents: stageA > 0.5 ? "auto" : "none" }}>
          <div className="max-w-3xl">
            <h2 className="display text-[clamp(3.2rem,8vw,7.5rem)]">
              <ScrubWords text="The real source of every slice." p={p} from={0} to={0.14} />
            </h2>
            <p className="mt-5 max-w-md text-lg">
              <ScrubWords text="Sourdough, 00 flour and sauces made from scratch. Nothing canned, nothing hurried." p={p} from={0.04} to={0.2} />
            </p>
          </div>
          <div className="flex flex-wrap gap-6 self-end sm:gap-12">
            {stats.map((s, i) => {
              const o = clamp((p - (s.from + i * 0.03)) / 0.04);
              return (
                <div key={s.label} className="text-right" style={{ opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
                  <div className="display text-[clamp(3rem,7vw,6rem)] text-gold">
                    {s.big}
                    <span className="text-[0.5em]">{s.unit}</span>
                  </div>
                  <div className="script text-xl">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* stage B: the single pie */}
        <div className="absolute inset-0 z-20 mx-auto flex max-w-[1600px] items-center px-6 sm:px-10" style={{ opacity: stageB, pointerEvents: "none" }}>
          <div className="max-w-md">
            <span className="script text-2xl text-accent">one pie, made whole</span>
            <h2 className="display mt-2 text-[clamp(3rem,7vw,6.5rem)]">
              <ScrubWords text="A single pie, from the fire." p={p} from={0.3} to={0.4} />
            </h2>
            <div className="mt-6 flex items-end gap-4">
              <span className="display text-8xl text-gold">48</span>
              <span className="script pb-3 text-2xl">hours of fermentation</span>
            </div>
          </div>
        </div>

        {/* stage C: the range */}
        <div className="absolute inset-0 z-20 mx-auto flex max-w-[1600px] items-center justify-end px-6 sm:px-10" style={{ opacity: stageC, pointerEvents: stageC > 0.5 ? "auto" : "none" }}>
          <div className="max-w-lg text-left">
            <h2 className="display text-[clamp(3rem,7vw,6.5rem)]">
              <ScrubWords text="Made by hand, fired in wood." p={p} from={0.56} to={0.64} />
            </h2>
            <p className="mt-5 text-lg">
              <ScrubWords text="From the classic Margherita to burrata and pesto, every pie is shaped by hand and cooked in our wood-fired oven." p={p} from={0.58} to={0.72} />
            </p>
            <div className="mt-6">
              <CircleButton href="/menu">Explore Pizzas</CircleButton>
            </div>
          </div>
        </div>

        {/* stage D: packaging shot, in front of the giant text */}
        <div
          aria-hidden={boxT === 0}
          className="absolute left-1/2 top-1/2 z-30 w-[min(70vw,440px)] -translate-x-1/2"
          style={{
            opacity: clamp(boxT * 3),
            transform: `translate3d(-50%, ${-50 + (1 - boxT) * 18}%, 0) scale(${0.8 + boxT * 0.2}) rotate(${(1 - boxT) * -8}deg)`,
          }}
        >
          <div className="relative aspect-square rounded-md border-4 border-ink bg-toffee shadow-[12px_14px_0_rgba(28,22,19,.9)]">
            <div className="absolute inset-3 rounded border-2 border-dashed border-ink/50" />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.85]">JP<br />Pizzeria</p>
                <p className="script mt-3 text-xl">wood-fired · Naples in Noida</p>
              </div>
            </div>
            <span className="script absolute -right-4 -top-4 rotate-12 rounded-full bg-accent px-4 py-2 text-lg text-paper">hot!</span>
          </div>
        </div>

        {/* frame counter + progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-6 pb-4 sm:px-10">
          <div className="mb-2 flex items-end justify-between text-sm tabular-nums">
            <span className="display text-3xl leading-none tracking-normal">{frame}</span>
            <span className="script text-lg text-ink/60">scroll to spin</span>
          </div>
          <div className="h-[3px] w-full bg-ink/15">
            <div className="h-full bg-accent" style={{ width: `${p * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
