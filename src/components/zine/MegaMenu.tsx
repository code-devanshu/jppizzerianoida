"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { megaLinks, site } from "@/data/site";
import { Branch, Check, Copy } from "./icons";
import { useBasket } from "./BasketProvider";
import { WaveText } from "./WaveText";

export function MegaMenu() {
  const { menuOpen, setMenuOpen } = useBasket();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      id="mega-menu"
      aria-hidden={!menuOpen}
      inert={!menuOpen}
      className="fixed inset-0 z-[55] overflow-hidden bg-ink text-paper transition-[clip-path,opacity] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
      style={{
        clipPath: menuOpen ? "circle(150% at 92% 6%)" : "circle(0% at 92% 6%)",
        opacity: menuOpen ? 1 : 0.6,
      }}
    >
      <Branch className="pointer-events-none absolute -right-24 top-1/2 h-[140vh] -translate-y-1/2 rotate-12 text-paper/[0.05]" />
      <Branch className="pointer-events-none absolute -left-32 top-1/2 h-[120vh] -translate-y-1/2 -rotate-[20deg] text-paper/[0.04]" />
      <nav aria-label="Main" className="relative flex h-full flex-col items-center justify-center gap-6 px-6">
        <ul className="flex flex-col items-center gap-1 sm:gap-2">
          {megaLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="script block text-[clamp(3.25rem,11vw,7.5rem)] leading-[1] text-paper transition-colors duration-300 hover:text-accent"
              >
                <WaveText text={l.label} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <span className="script text-2xl text-paper/60">Call or WhatsApp</span>
          <div className="flex items-center gap-2">
            <a href={`tel:${site.phoneTel}`} className="text-base underline-offset-4 hover:underline">
              {site.phone}
            </a>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy phone number"
              className="grid size-9 place-items-center rounded-md border border-paper/25 transition active:scale-90 hover:bg-paper/10"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
            <span aria-live="polite" className="w-16 text-paper/70">{copied ? "Copied!" : ""}</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
