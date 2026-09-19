import type { CSSProperties } from "react";

/**
 * Scalloped crust edge. `color` is the section the edge belongs to (the half circles bulge into the
 * neighbouring section). Place it at the top of a dark section with dir="up".
 */
export function Scallop({ color = "var(--color-ink)", dir = "up", className = "" }: { color?: string; dir?: "up" | "down"; className?: string }) {
  return (
    <div
      aria-hidden
      className={`${dir === "down" ? "scallop-down" : "scallop"} pointer-events-none w-full ${className}`}
      style={{ "--scallop": color } as CSSProperties}
    />
  );
}
