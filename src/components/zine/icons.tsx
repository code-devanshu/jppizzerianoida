import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

/** Two-tone pizza slice. `fill` (0-100) floods it from the bottom in the accent colour. */
export function PizzaIcon({ fill = 100, className, style }: IconProps & { fill?: number }) {
  const y = 64 - (64 * fill) / 100;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden>
      <defs>
        <clipPath id="pz-fill">
          <rect x="0" y={y} width="64" height="64" />
        </clipPath>
      </defs>
      <g fill="currentColor" opacity={fill >= 100 ? 0 : 0.28}>
        <path d="M32 60 6 14a44 44 0 0 1 52 0Z" />
      </g>
      <g clipPath="url(#pz-fill)">
        <path d="M32 60 6 14a44 44 0 0 1 52 0Z" fill="var(--pz-accent, #e2583e)" />
        <circle cx="26" cy="26" r="4.5" fill="var(--pz-dot, #f6efe1)" opacity=".85" />
        <circle cx="39" cy="22" r="3.5" fill="var(--pz-dot, #f6efe1)" opacity=".85" />
        <circle cx="32" cy="38" r="4" fill="var(--pz-dot, #f6efe1)" opacity=".85" />
      </g>
      <path d="M6 14a44 44 0 0 1 52 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Basil / olive branch silhouette (stand-in for the palm leaf). */
export function Branch({ className, style }: IconProps) {
  const leaves = Array.from({ length: 9 });
  return (
    <svg viewBox="0 0 200 400" className={className} style={style} aria-hidden fill="currentColor">
      <path d="M100 400C96 300 98 180 108 10" stroke="currentColor" strokeWidth="5" fill="none" />
      {leaves.map((_, i) => {
        const y = 370 - i * 38;
        return (
          <g key={i}>
            <path d={`M100 ${y} C60 ${y - 34} 30 ${y - 20} 14 ${y - 4} C50 ${y + 6} 80 ${y + 2} 100 ${y}Z`} />
            <path d={`M100 ${y - 14} C140 ${y - 48} 172 ${y - 34} 188 ${y - 18} C152 ${y - 8} 122 ${y - 12} 100 ${y - 14}Z`} />
          </g>
        );
      })}
    </svg>
  );
}

export function Basket({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8Z" />
      <path d="M8.5 9 11 4m4.5 5L13 4" />
    </svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Arrow({ className, dir = "right" }: IconProps & { dir?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function Quote({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden>
      <path d="M8 30c0-9 4-16 12-20l2 3c-4 3-6 6-6 10h6v13H8Zm20 0c0-9 4-16 12-20l2 3c-4 3-6 6-6 10h6v13H28Z" />
    </svg>
  );
}

export function Copy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export function Check({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Hand-drawn curved arrow used next to annotations. */
export function CurvedArrow({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 12C40 4 92 14 100 60" />
      <path d="m88 52 12 10 10-14" />
    </svg>
  );
}

/** Hand-drawn ellipse that circles a button label. */
export function Scribble({ className }: IconProps) {
  return (
    <svg viewBox="0 0 220 80" className={className} preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M40 10C10 14 4 34 8 50c6 20 60 26 108 24 60-2 98-14 96-40C210 12 150 4 96 6c-24 1-44 4-58 12" />
    </svg>
  );
}

export const toppingPaths = {
  tomato: { color: "#e2382a", d: "M32 14c-14 0-22 9-22 20s9 20 22 20 22-9 22-20-8-20-22-20Z" },
  basil: { color: "#2f8a3a", d: "M32 8C14 18 10 40 32 58 54 40 50 18 32 8Z" },
  olive: { color: "#4d5a25", d: "M32 10c-12 0-18 10-18 22s6 22 18 22 18-10 18-22-6-22-18-22Z" },
  pepperoni: { color: "#b12a1c", d: "M32 8a24 24 0 1 0 .1 0Z" },
  cheese: { color: "#f3d675", d: "M6 44 32 12l26 32Z" },
  chili: { color: "#d42a12", d: "M14 14c20 0 38 12 38 32-14-2-26-10-38-32Z" },
} as const;
export type ToppingKind = keyof typeof toppingPaths;
