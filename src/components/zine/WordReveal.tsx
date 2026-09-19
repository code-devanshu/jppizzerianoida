"use client";

import { useEffect, useRef } from "react";

/** Body copy split per word; each word fades and rises as the block scrolls through the viewport. */
export function WordReveal({ text, as: Tag = "p", className = "" }: { text: string; as?: "p" | "h2" | "h3" | "span"; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top hits 90% of the viewport, 1 when its top reaches 45%.
      const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.45 + r.height * 0.5)));
      spans.forEach((s, i) => {
        const local = Math.min(1, Math.max(0, p * (spans.length + 6) - i) / 6);
        s.style.opacity = String(0.12 + local * 0.88);
        s.style.transform = `translateY(${(1 - local) * 0.35}em)`;
      });
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
  }, [text]);

  return (
    <Tag ref={root as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden data-w className={`inline-block will-change-transform`} style={{ opacity: 0.12 }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
