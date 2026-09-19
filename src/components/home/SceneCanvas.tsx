"use client";

import dynamic from "next/dynamic";
import type { SceneControls } from "./PizzaScene";

const PizzaScene = dynamic(() => import("./PizzaScene"), { ssr: false });

/** Lazy client-only wrapper around the Three.js pizza, driven by scroll (spin) and pointer/gyro (tilt). */
export function SceneCanvas({ controls, className = "" }: { controls: SceneControls; className?: string }) {
  return (
    <div className={className}>
      <PizzaScene controls={controls} />
    </div>
  );
}
