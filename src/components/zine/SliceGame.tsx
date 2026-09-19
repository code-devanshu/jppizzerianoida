"use client";

import { useEffect, useRef, useState } from "react";
import { toppingPaths, type ToppingKind } from "./icons";

type Item = { kind: ToppingKind; x: number; y: number; vx: number; vy: number; r: number; rot: number; spin: number; bomb: boolean; alive: boolean; respawnAt: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };
type Trail = { x: number; y: number; t: number };

const KINDS = Object.keys(toppingPaths) as ToppingKind[];
const COUNT = 9;
const LIVES = 3;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Canvas mini-game: drag across drifting toppings to slice them into particles. */
export function SliceGame() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [frozen, setFrozen] = useState(false);
  const [menu, setMenu] = useState(false);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    document.documentElement.style.overflow = frozen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [frozen]);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const paths = Object.fromEntries(KINDS.map((k) => [k, new Path2D(toppingPaths[k].d)])) as Record<ToppingKind, Path2D>;

    const spawn = (i: number): Item => ({
      kind: KINDS[i % KINDS.length],
      x: rand(0.08, 0.92) * (w || 800),
      y: rand(0.15, 0.85) * (h || 400),
      vx: rand(-18, 18),
      vy: rand(-12, 12),
      r: rand(34, 52),
      rot: rand(0, 6.28),
      spin: rand(-0.4, 0.4),
      bomb: Math.random() < 0.16,
      alive: true,
      respawnAt: 0,
    });
    let items: Item[] = Array.from({ length: COUNT }, (_, i) => spawn(i));
    let particles: Particle[] = [];
    let trail: Trail[] = [];
    let down = false;
    let last: { x: number; y: number } | null = null;
    let points = 0;
    let left = LIVES;

    const resize = () => {
      w = box.clientWidth;
      h = box.clientHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    const burst = (it: Item) => {
      const color = it.bomb ? "#f5a623" : toppingPaths[it.kind].color;
      for (let i = 0; i < 14; i++) {
        const a = rand(0, Math.PI * 2);
        const s = rand(90, 260);
        particles.push({ x: it.x, y: it.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, life: 1, color, size: rand(2.5, 6) });
      }
    };

    // Segment vs circle: distance from item centre to the swipe segment.
    const hits = (ax: number, ay: number, bx: number, by: number, it: Item) => {
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((it.x - ax) * dx + (it.y - ay) * dy) / len2));
      return Math.hypot(ax + t * dx - it.x, ay + t * dy - it.y) < it.r;
    };

    const pos = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      down = true;
      last = pos(e);
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down || !last) return;
      const p = pos(e);
      trail.push({ ...p, t: performance.now() });
      const now = performance.now();
      if (left <= 0) {
        last = p;
        return;
      }
      items.forEach((it) => {
        if (it.alive && hits(last!.x, last!.y, p.x, p.y, it)) {
          it.alive = false;
          it.respawnAt = now + 2200;
          burst(it);
          if (it.bomb) {
            left -= 1;
            setLives(left);
          } else {
            points += 1;
            setScore(points);
          }
        }
      });
      last = p;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      last = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    resetRef.current = () => {
      points = 0;
      left = LIVES;
      setScore(0);
      setLives(LIVES);
      items = Array.from({ length: COUNT }, (_, i) => spawn(i));
      particles = [];
    };

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(box);
    let raf = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);

      items.forEach((it, i) => {
        if (!it.alive) {
          if (now > it.respawnAt) items[i] = spawn(i + Math.floor(Math.random() * 3));
          return;
        }
        if (!reduce && left > 0) {
          it.x += it.vx * dt;
          it.y += it.vy * dt;
          it.rot += it.spin * dt;
        }
        if (it.x < -50) it.x = w + 50;
        if (it.x > w + 50) it.x = -50;
        if (it.y < -50) it.y = h + 50;
        if (it.y > h + 50) it.y = -50;
        const s = it.r / 32;
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.scale(s, s);
        ctx.translate(-32, -32);
        if (it.bomb) {
          // burnt pizza: dark disc with a butter rim and a lit fuse. Slicing it costs a life.
          ctx.beginPath();
          ctx.arc(32, 34, 24, 0, Math.PI * 2);
          ctx.fillStyle = "#0e0a08";
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#f5e2a0";
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(44, 16);
          ctx.quadraticCurveTo(52, 6, 58, 10);
          ctx.strokeStyle = "#f5e2a0";
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(58, 10, 4 + Math.sin(now / 90) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#f5a623";
          ctx.fill();
        } else {
          ctx.fillStyle = toppingPaths[it.kind].color;
          ctx.globalAlpha = 0.95;
          ctx.fill(paths[it.kind]);
        }
        ctx.restore();
      });

      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.vy += 620 * dt; // gravity
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 0.9;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      trail = trail.filter((t) => now - t.t < 220);
      if (trail.length > 1) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#f6efe1";
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          ctx.globalAlpha = Math.max(0, 1 - (now - trail[i].t) / 220);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <>
      <div ref={wrap} className="absolute inset-0 z-10">
        <canvas
          ref={canvas}
          aria-hidden
          className="block size-full cursor-crosshair"
          style={{ touchAction: frozen ? "none" : "pan-y" }}
        />
      </div>
      {lives <= 0 && (
        <div className="animate-pop absolute inset-x-0 top-[12%] z-20 flex flex-col items-center gap-3 text-center">
          <span className="script text-3xl text-butter">burnt! that one was a bomb</span>
          <button type="button" onClick={() => resetRef.current()} className="rounded-full bg-butter px-6 py-2 font-medium text-ink transition active:scale-95 hover:bg-paper">
            Play again
          </button>
        </div>
      )}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 text-xs text-paper/80 sm:bottom-6 sm:right-8">
        {menu && (
          <div className="animate-pop flex items-center gap-2 rounded-md bg-paper/10 p-1 backdrop-blur">
            <button type="button" onClick={() => resetRef.current()} className="rounded px-2 py-1 transition active:scale-90 hover:bg-paper/15">
              Reset
            </button>
          </div>
        )}
        <button type="button" aria-label="Game menu" onClick={() => setMenu((m) => !m)} className="rounded-full px-2 py-1 tracking-widest transition active:scale-90 hover:bg-paper/15">
          •••
        </button>
        <button
          type="button"
          aria-pressed={frozen}
          onClick={() => setFrozen((f) => !f)}
          className={`rounded-full border px-4 py-2 transition active:scale-90 ${frozen ? "border-accent bg-accent text-paper" : "border-paper/30 hover:bg-paper/15"}`}
        >
          {frozen ? "Unfreeze Scroll" : "Freeze Scroll"}
        </button>
        <span className="flex items-center gap-3 rounded-full border border-paper/25 px-4 py-1.5 tabular-nums">
          <span className="text-sm tracking-widest">SCORE <span className="display inline-block align-middle text-2xl leading-normal text-butter">{score}</span></span>
          <span className="h-5 w-px bg-paper/25" />
          <span className="flex gap-1.5" aria-label={`${lives} lives left`}>
            {Array.from({ length: LIVES }, (_, i) => (
              <span key={i} className={`size-2.5 rounded-full transition ${i < lives ? "bg-accent" : "bg-paper/25"}`} />
            ))}
          </span>
        </span>
      </div>
    </>
  );
}
