"use client";

import { useEffect, useState } from "react";

const KEY = "vf-cookies";

export function CookieToast() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let done = false;
    try {
      done = !!localStorage.getItem(KEY);
    } catch {}
    if (done) return;
    const t = window.setTimeout(() => setShow(true), 3200);
    return () => window.clearTimeout(t);
  }, []);
  const close = (v: string) => {
    setShow(false);
    if (v === "ok") {
      try {
        localStorage.setItem(KEY, "1");
      } catch {}
    }
  };
  if (!show) return null;
  return (
    <div role="dialog" aria-label="Cookie consent" className="animate-pop fixed bottom-5 left-1/2 z-40 flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-3 rounded-2xl bg-paper p-4 shadow-2xl ring-1 ring-ink/15 sm:flex-row sm:items-center">
      <p className="flex-1 text-sm">We use cookies to improve your experience.</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => close("later")} className="script rounded-md px-3 py-1.5 text-lg transition active:scale-90 hover:bg-ink/10">Later</button>
        <button type="button" onClick={() => close("ok")} className="script rounded-md bg-ink px-4 py-1.5 text-lg text-paper transition active:scale-90 hover:bg-accent">Okay</button>
      </div>
    </div>
  );
}
