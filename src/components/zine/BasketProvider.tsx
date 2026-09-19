"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type BasketLine = { key: string; id: string; name: string; tier: string; unit: number; qty: number };

type Ctx = {
  lines: BasketLine[];
  total: number;
  count: number;
  add: (line: Omit<BasketLine, "key" | "qty">, qty?: number) => void;
  remove: (key: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
};

const BasketContext = createContext<Ctx | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const add: Ctx["add"] = useCallback((line, qty = 1) => {
    const key = `${line.id}:${line.tier}`;
    setLines((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { ...line, key, qty }];
    });
  }, []);
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      total: lines.reduce((s, l) => s + l.unit * l.qty, 0),
      count: lines.reduce((s, l) => s + l.qty, 0),
      add,
      remove,
      drawerOpen,
      setDrawerOpen,
      menuOpen,
      setMenuOpen,
    }),
    [lines, add, remove, drawerOpen, menuOpen],
  );
  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}
