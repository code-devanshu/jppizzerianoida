"use client";

import { useEffect, useRef } from "react";

/** Live pointer position (desktop) and device orientation (mobile) as a smoothed -1..1 tilt. */
export function useTilt() {
  const tilt = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const target = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      target.x = Math.max(-1, Math.min(1, e.gamma / 30));
      target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    const loop = () => {
      tilt.current.x += (target.x - tilt.current.x) * 0.08;
      tilt.current.y += (target.y - tilt.current.y) * 0.08;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onOrient);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      cancelAnimationFrame(raf);
    };
  }, []);
  return tilt;
}

type DOEWithPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/** True on iOS-style browsers where deviceorientation needs an explicit permission prompt. */
export function gyroNeedsPermission() {
  const DOE = window.DeviceOrientationEvent as unknown as DOEWithPermission | undefined;
  return typeof DOE?.requestPermission === "function";
}

/** iOS gates deviceorientation behind a user gesture (click/touchend); call this from a tap. Resolves true once motion is allowed. */
export async function requestGyro(): Promise<boolean> {
  const DOE = window.DeviceOrientationEvent as unknown as DOEWithPermission | undefined;
  try {
    if (typeof DOE?.requestPermission === "function") return (await DOE.requestPermission()) === "granted";
    return true;
  } catch {
    return false;
  }
}
