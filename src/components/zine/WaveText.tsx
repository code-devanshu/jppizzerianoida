import type { CSSProperties } from "react";

/** Splits text into letters so hovering the parent `.wave` makes them jelly out of the baseline. */
export function WaveText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`wave inline-block ${className}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="wave-l" style={{ "--i": i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}
