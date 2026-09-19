"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { dishes, menuFilters, type MenuCategory } from "@/data/menu";
import { inr } from "@/lib/format";

export function MenuExperience() {
  const [filter, setFilter] = useState<"all" | MenuCategory>("all");
  const [toast, setToast] = useState<{ title: string; message: string; id: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((title: string, message: string) => {
    clearTimeout(timer.current);
    setToast({ title, message, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const visible = dishes.filter((d) => filter === "all" || d.category === filter);

  return (
    <>
      {/* Sticky category nav */}
      <nav aria-label="Menu categories" className="sticky top-0 z-30 border-b border-ink/15 bg-paper shadow-[0_1px_0_rgba(28,22,19,0.04)]">
        {/* Top padding clears the fixed site header so the pills never slide under it */}
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 pb-3 pt-22 sm:pt-26 lg:px-12">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {menuFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  document.getElementById("ricettario")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`h-10 shrink-0 rounded-full border px-5 text-title-sm transition ${
                  filter === f.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 bg-transparent text-ink/70 hover:border-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Archive */}
      <section id="ricettario" className="scroll-mt-40 py-16 lg:py-24">
        <div className="mx-auto max-w-[1360px] px-5 lg:px-12">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="space-y-3">
              <span className="script text-2xl text-accent">pizzas, sides &amp; dessert</span>
              <h2 className="display text-[clamp(3rem,7vw,6rem)]">The Menu</h2>
            </div>
            <p className="max-w-md text-body-lg text-ink/65">
              Neapolitan pizza on 48-hour sourdough, with sauces made from scratch. Prices and the full list are confirmed at the café.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
            {visible.map((d, i) => {
              return (
                <Reveal key={d.id} delay={(i % 3) * 90}>
                  <TiltCard className="border border-ink/15 flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-[0_10px_28px_-16px_rgba(28,22,19,0.35)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-butter">
                      {d.image ? (
                        <Image
                          src={d.image}
                          alt={d.alt ?? d.name}
                          fill
                          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
                          className="object-cover"
                        />
                      ) : (
                        <span aria-hidden className="display absolute inset-0 grid place-items-center px-6 text-center text-5xl text-ink/25">
                          {d.name}
                        </span>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-label-sm uppercase text-ink backdrop-blur">
                        {d.stamp}
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-label-md uppercase text-paper">
                        {inr(d.price)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="display text-3xl tracking-normal text-ink">{d.name}</h3>
                      <p className="text-body-sm text-ink/65">{d.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1 text-label-sm uppercase text-ink/50">
                        {d.tags.map((t) => (
                          <span key={t} className="rounded-full border border-ink/15 px-2.5 py-1">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-3 border-t border-ink/15 bg-ink/5 p-4">
                      <button
                        type="button"
                        onClick={() => notify("Added to Your Order", `${d.name} was added to your order.`)}
                        className="flex items-center justify-center gap-2 rounded-full border border-ink/25 px-4 py-2.5 text-title-sm text-ink transition hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.98]"
                      >
                        <ShoppingCart className="size-4" />
                        Add to Order
                      </button>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>

          <p className="mt-12 text-center text-body-md text-ink/65">
            Ready to order?{" "}
            <Link href="/booking" className="text-accent underline underline-offset-4 hover:text-ink">
              Book a table or order takeaway
            </Link>
          </p>
        </div>
      </section>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-6 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
      >
        {toast && (
          <div key={toast.id} className="animate-toast flex border border-ink/20 max-w-sm items-start gap-3 rounded-2xl bg-paper p-4 shadow-[0_18px_40px_-18px_rgba(28,22,19,0.35)]">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-paper">
              <Check className="size-4" />
            </span>
            <div>
              <h5 className="font-display font-semibold uppercase text-title-md text-ink">{toast.title}</h5>
              <p className="text-body-sm text-ink/65">{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
