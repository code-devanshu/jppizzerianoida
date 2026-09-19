"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useBasket } from "@/components/zine/BasketProvider";
import { Check, Plus } from "@/components/zine/icons";
import { CircleButton } from "@/components/zine/CircleButton";
import { dishes } from "@/data/menu";
import { inr } from "@/lib/format";

const picks = ["margherita", "burrata", "pesto"]
  .map((id) => dishes.find((d) => d.id === id)!)
  .filter(Boolean);
const tones = ["bg-butter", "bg-toffee", "bg-blush"];

const tiers = [
  { id: "Single", qty: 1, off: 0, blurb: "One pie, straight from the oven" },
  { id: "Pair", qty: 2, off: 0, blurb: "Two pies to share" },
  { id: "Family box", qty: 4, off: 0, blurb: "Four pies for the table" },
];

function Card({ dish, tone, open, onToggle, onClose }: { dish: (typeof picks)[number]; tone: string; open: boolean; onToggle: () => void; onClose: () => void }) {
  const { add, setDrawerOpen } = useBasket();
  const [added, setAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && onClose();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open, onClose]);

  const pick = (t: (typeof tiers)[number]) => {
    add({ id: dish.id, name: dish.name, tier: t.id, unit: dish.price * t.qty * (1 - t.off) });
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1100);
  };

  return (
    <div ref={ref} className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${tone}`}>
      <div className="absolute inset-x-[8%] top-[6%] aspect-square overflow-hidden rounded-full border-4 border-paper shadow-lg transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:rotate-6 hover:scale-105">
        <Image src={dish.image!} alt={dish.alt ?? dish.name} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
      </div>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
        <div>
          <p className="display text-4xl sm:text-5xl">{dish.name}</p>
          <p className="script text-xl">{inr(dish.price)}</p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close size picker" : `Add ${dish.name}`}
          onClick={onToggle}
          className="relative z-30 grid size-14 place-items-center rounded-full bg-ink text-paper transition duration-300 active:scale-90 hover:bg-accent"
        >
          <Plus className={`size-6 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="animate-pop absolute inset-x-3 bottom-3 z-20 rounded-2xl bg-ink p-5 pb-20 text-paper shadow-2xl">
          {added ? (
            <p className="flex items-center justify-center gap-2 py-8 text-center display text-3xl">
              <Check className="size-7 text-gold" /> Added to basket
            </p>
          ) : (
            <>
              <p className="script mb-3 text-2xl text-gold">Pick a size</p>
              <ul className="space-y-1">
                {tiers.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => pick(t)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition duration-300 active:scale-[0.97] hover:bg-paper/10"
                    >
                      <span>
                        <span className="display block text-2xl">{t.id}</span>
                        <span className="text-xs text-paper/60">{t.blurb}</span>
                      </span>
                      <span className="text-sm tabular-nums">{inr(dish.price * t.qty * (1 - t.off))}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => { onClose(); setDrawerOpen(true); }} className="script mt-2 text-lg text-paper/80 underline underline-offset-4 hover:text-accent">
                View basket
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function FlavourGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display text-[clamp(3.2rem,8vw,7.5rem)]">Explore all pizzas</h2>
        <CircleButton href="/menu">See the full menu</CircleButton>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {picks.map((d, i) => (
          <Card
            key={d.id}
            dish={d}
            tone={tones[i % tones.length]}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
            onClose={() => setOpenId((cur) => (cur === d.id ? null : cur))}
          />
        ))}
      </div>
    </section>
  );
}
