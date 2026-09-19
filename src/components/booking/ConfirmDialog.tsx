"use client";

import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";

export type Confirmation = {
  title: string;
  description: string;
  rows: [string, string][];
};

export function ConfirmDialog({
  confirmation,
  onClose,
}: {
  confirmation: Confirmation | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (confirmation && !dialog.open) dialog.showModal();
    if (!confirmation && dialog.open) dialog.close();
  }, [confirmation]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-ink/20 bg-white/70 p-0 text-ink shadow-[0_18px_40px_-18px_rgba(28,22,19,0.35)] backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      {confirmation && (
        <div className="flex flex-col items-center gap-5 p-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
            <Flame className="size-8 animate-flicker" />
          </span>
          <span className="text-label-md uppercase text-accent">Confirmed</span>
          <h3 id="confirm-title" className="font-display font-semibold uppercase text-headline-md text-ink">
            {confirmation.title}
          </h3>
          <p className="text-body-md text-ink/65">{confirmation.description}</p>
          <dl className="w-full space-y-2 rounded-lg bg-ink/5 p-4 text-left text-body-sm">
            {confirmation.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink/65">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="w-full rounded bg-accent px-5 py-3.5 text-title-sm text-paper transition hover:bg-ink active:scale-[0.98]"
          >
            Close &amp; Back to the Menu
          </button>
        </div>
      )}
    </dialog>
  );
}
