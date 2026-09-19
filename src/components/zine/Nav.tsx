"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Basket, PizzaIcon } from "./icons";
import { useBasket } from "./BasketProvider";
import { MegaMenu } from "./MegaMenu";
import { BasketDrawer } from "./BasketDrawer";

export function Nav() {
  const { count, menuOpen, setMenuOpen, drawerOpen, setDrawerOpen } = useBasket();
  const [overInk, setOverInk] = useState(false);

  // Invert the chrome whenever a dark section ([data-invert]) sits behind it.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = 36;
      const hit = Array.from(document.querySelectorAll("[data-invert]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setOverInk(hit);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = window.setInterval(check, 600); // catches route swaps
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const inverted = overInk || menuOpen;
  const btn = `transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] active:scale-90 ${
    inverted ? "bg-paper text-ink hover:bg-accent-soft" : "bg-ink text-paper hover:bg-accent"
  }`;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between p-4 sm:p-6">
        <Link
          href="/"
          aria-label="JP Pizzeria — home"
          className={`pointer-events-auto transition-colors duration-300 active:scale-90 ${inverted ? "text-paper" : "text-ink"}`}
        >
          <PizzaIcon className="size-11 [--pz-dot:var(--color-paper)] sm:size-12" />
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={`Open basket, ${count} items`}
            onClick={() => setDrawerOpen(true)}
            className={`relative grid size-11 place-items-center rounded-md ${btn}`}
          >
            <Basket className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-accent text-[11px] font-medium text-paper">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mega-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`display h-11 min-w-24 rounded-md px-5 text-xl leading-none tracking-normal ${btn}`}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <MegaMenu />
      <BasketDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
