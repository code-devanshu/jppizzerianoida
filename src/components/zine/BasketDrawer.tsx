"use client";

import Link from "next/link";
import { useEffect } from "react";
import { inr } from "@/lib/format";
import { useBasket } from "./BasketProvider";
import { PizzaIcon } from "./icons";

export function BasketDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, total, remove } = useBasket();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <button
        type="button"
        aria-label="Close basket"
        onClick={onClose}
        tabIndex={-1}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-[10px] transition-opacity duration-300 ease-[cubic-bezier(0,0,.2,1)] ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Basket"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper text-ink shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-ink/15 p-6">
          <h2 className="display text-4xl">Basket</h2>
          <button type="button" onClick={onClose} className="script rounded-md px-3 py-1 text-xl transition active:scale-90 hover:bg-ink/10">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <PizzaIcon fill={0} className="size-28 text-ink/40" />
              <p className="display text-3xl">Nothing baked yet</p>
              <p className="text-ink/70">Your basket is hungry.</p>
              <Link href="/menu" onClick={onClose} className="script text-2xl underline underline-offset-4 hover:text-accent">
                Go pick a pizza
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center justify-between gap-4 rounded-xl bg-butter/60 p-4">
                  <div>
                    <p className="display text-2xl">{l.name}</p>
                    <p className="text-sm text-ink/70">
                      {l.tier} × {l.qty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{inr(l.unit * l.qty)}</p>
                    <button type="button" onClick={() => remove(l.key)} className="script text-lg text-accent underline">
                      remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sticky bottom-0 space-y-4 border-t border-ink/15 bg-paper p-6">
          <div className="flex items-baseline justify-between">
            <span className="script text-2xl">Total</span>
            <span className="display text-4xl">{inr(total)}</span>
          </div>
          <Link
            href="/booking"
            onClick={onClose}
            className="display block w-full rounded-xl bg-ink py-4 text-center text-2xl tracking-normal text-paper transition duration-300 active:scale-95 hover:bg-accent"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
