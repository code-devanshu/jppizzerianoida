import Link from "next/link";
import type { ReactNode } from "react";
import { Scribble } from "./icons";

/** Handwritten label circled by a hand-drawn ellipse; presses down to 90%. */
export function CircleButton({ href, children, tone = "ink", className = "", onClick }: { href?: string; children: ReactNode; tone?: "ink" | "light"; className?: string; onClick?: () => void }) {
  const cls = `group relative inline-flex items-center justify-center px-9 py-4 font-script text-2xl transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] active:scale-90 ${
    tone === "light" ? "text-paper" : "text-ink"
  } ${className}`;
  const inner = (
    <>
      <Scribble className="absolute inset-0 size-full transition-transform duration-300 group-hover:scale-105" />
      <span className="relative">{children}</span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{inner}</button>
  );
}
