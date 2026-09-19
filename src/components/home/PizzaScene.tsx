"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { images } from "@/data/images";

export type SceneControls = {
  /** 0..1 scroll progress; drives a 1:1 spin when provided. */
  spin: { current: number };
  /** -1..1 pointer / gyro tilt. */
  tilt: { current: { x: number; y: number } };
};

type Props = {
  /** Camera pushes in on the cornicione when true. */
  zoomed?: boolean;
  /** Scroll/pointer-driven mode: no hearth, fog, embers or drag; transparent over the page. */
  controls?: SceneControls;
};

const EMBER_COUNT = 280;

/** 1024² canvas: baked dough, leopard char spots around the rim and a sauce disc. */
function createCrustTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#cf9957";
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 40000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(235,185,120,0.15)" : "rgba(110,60,20,0.12)";
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
  }

  for (let i = 0; i < 350; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 360 + Math.random() * 130;
    const cx = 512 + Math.cos(angle) * dist;
    const cy = 512 + Math.sin(angle) * dist;
    const radius = 6 + Math.random() * 18;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    grad.addColorStop(0, "#100e0c");
    grad.addColorStop(0.5, "#2e1c0d");
    grad.addColorStop(0.85, "#824819");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const sauce = ctx.createRadialGradient(512, 512, 40, 512, 512, 360);
  sauce.addColorStop(0, "#a51808");
  sauce.addColorStop(0.7, "#881206");
  sauce.addColorStop(1, "rgba(165,24,8,0)");
  ctx.fillStyle = sauce;
  ctx.beginPath();
  ctx.arc(512, 512, 360, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createEmberSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.2, "#fcbf60");
  grad.addColorStop(0.6, "#dda448");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function PizzaScene({ zoomed = false, controls }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomedRef = useRef(zoomed);
  const controlsRef = useRef(controls);
  const rotateBy = useRef<(dx: number, dy: number) => void>(() => {});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    zoomedRef.current = zoomed;
  }, [zoomed]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL unavailable: swap to the static fallback
      setFailed(true);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    if (!controlsRef.current) scene.fog = new THREE.FogExp2(0x161311, 0.045);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 4.6, 8.4);

    const pizza = new THREE.Group();
    scene.add(pizza);

    const crustTexture = track(createCrustTexture());

    // Cornicione: a torus with organic vertex noise, flattened into a pizza profile.
    const rimGeo = track(new THREE.TorusGeometry(2.35, 0.44, 32, 64));
    const pos = rimGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const w = pos.getZ(i);
      const noise = (Math.sin(u * 5) * Math.cos(w * 4) + Math.sin(v * 7)) * 0.045;
      pos.setXYZ(i, u + noise, v + noise, w + noise);
    }
    rimGeo.computeVertexNormals();
    const rim = new THREE.Mesh(
      rimGeo,
      track(new THREE.MeshStandardMaterial({ map: crustTexture, roughness: 0.85, metalness: 0.05, color: 0xdeb076 })),
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.z = 0.55;
    pizza.add(rim);

    const sauceGeo = track(new THREE.CylinderGeometry(2.35, 2.35, 0.08, 64));
    const sauce = new THREE.Mesh(
      sauceGeo,
      track(new THREE.MeshStandardMaterial({ color: 0x9b1c0b, roughness: 0.38, metalness: 0.12, map: crustTexture })),
    );
    sauce.position.y = -0.04;
    pizza.add(sauce);

    const mozzarellaMat = track(new THREE.MeshStandardMaterial({ color: 0xfef9eb, roughness: 0.28, metalness: 0.05 }));
    ([[0.6, 0.7], [-0.8, 0.5], [-0.5, -0.9], [0.9, -0.6], [0.1, -0.2], [-0.2, 0.9], [1.3, 0.2], [-1.2, -0.3], [0.2, -1.3]] as const).forEach(
      ([x, z]) => {
        const geo = track(new THREE.SphereGeometry(0.32 + Math.random() * 0.14, 16, 12));
        geo.scale(1 + Math.random() * 0.4, 0.3, 1 + Math.random() * 0.4);
        const blob = new THREE.Mesh(geo, mozzarellaMat);
        blob.position.set(x * 1.25, 0.06, z * 1.25);
        blob.rotation.y = Math.random() * Math.PI;
        pizza.add(blob);
      },
    );

    const basilMat = track(
      new THREE.MeshStandardMaterial({ color: 0x1f7324, roughness: 0.45, metalness: 0.1, side: THREE.DoubleSide }),
    );
    ([[-0.4, 0.3], [0.5, -0.4], [0.2, 0.8], [-0.7, -0.5], [0.8, 0.6]] as const).forEach(([x, z]) => {
      const geo = track(new THREE.ConeGeometry(0.24, 0.6, 6));
      geo.scale(1, 0.1, 1.4);
      const leaf = new THREE.Mesh(geo, basilMat);
      leaf.position.set(x * 1.3, 0.14, z * 1.3);
      leaf.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      leaf.rotation.z = Math.random() * Math.PI * 2;
      pizza.add(leaf);
    });

    const hearth = new THREE.Mesh(
      track(new THREE.CylinderGeometry(3.5, 3.65, 0.25, 64)),
      track(new THREE.MeshStandardMaterial({ color: 0x181412, roughness: 0.95, metalness: 0.15 })),
    );
    hearth.position.y = -0.22;
    if (!controlsRef.current) pizza.add(hearth);

    // Rising embers
    const emberGeo = track(new THREE.BufferGeometry());
    const emberPos = new Float32Array(EMBER_COUNT * 3);
    const emberRise: number[] = [];
    for (let i = 0; i < EMBER_COUNT; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 6;
      emberPos[i * 3 + 1] = Math.random() * 4 - 0.5;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      emberRise.push(0.5 + Math.random() * 1.1); // units per second
    }
    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
    const emberSprite = track(createEmberSprite());
    const embers = new THREE.Points(
      emberGeo,
      track(
        new THREE.PointsMaterial({
          size: 0.18,
          map: emberSprite,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          color: 0xffa34d,
        }),
      ),
    );
    if (!controlsRef.current) scene.add(embers);

    // Lights (physical units: point lights fall off with distance²)
    scene.add(new THREE.AmbientLight(0xffeedd, 1.1));
    const flame = new THREE.PointLight(0xff7722, 70, 14);
    flame.position.set(2.5, 3.5, 2.5);
    scene.add(flame);
    const rimLight = new THREE.PointLight(0xfcbf60, 40, 12);
    rimLight.position.set(-3.2, 1.8, -2);
    scene.add(rimLight);

    // Interaction state
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetY = 0.5;
    let targetX = 0.42;

    const clampX = () => {
      targetX = Math.max(0.1, Math.min(1.2, targetX));
    };
    rotateBy.current = (dx, dy) => {
      targetY += dx;
      targetX += dy;
      clampX();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetY += (e.clientX - lastX) * 0.007;
      targetX += (e.clientY - lastY) * 0.005;
      clampX();
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
    };
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Only animate while visible and the tab is active.
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    visibilityObserver.observe(container);

    const clock = new THREE.Clock();
    let raf = 0;
    const lookAt = new THREE.Vector3();

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        clock.getDelta();
        return;
      }
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;

      const ctl = controlsRef.current;
      if (ctl) {
        // Scroll-scrubbed spin (1:1 with progress) plus live tilt.
        targetY = 0.5 + ctl.spin.current * Math.PI * 6;
        targetX = 0.55 + ctl.tilt.current.y * 0.35;
        targetY += ctl.tilt.current.x * 0.5;
      } else if (!dragging && !reducedMotion) targetY += delta * 0.35;
      pizza.rotation.y += (targetY - pizza.rotation.y) * 0.08;
      pizza.rotation.x += (targetX - pizza.rotation.x) * 0.08;

      // Scroll dollies the camera back and slightly down.
      const scroll = ctl ? 0 : Math.min(window.scrollY / 1200, 1);
      const isZoomed = zoomedRef.current;
      const camY = ctl ? 5.6 : (isZoomed ? 2.6 : 4.6) - scroll * 1.5;
      const camZ = ctl ? 11.2 : (isZoomed ? 4.8 : 8.4) + scroll * 2.2;
      camera.position.y += (camY - camera.position.y) * 0.08;
      camera.position.z += (camZ - camera.position.z) * 0.08;
      camera.lookAt(lookAt.set(0, -scroll * 0.4, 0));

      flame.intensity = 62 + Math.sin(time * 12) * 8 + Math.cos(time * 24) * 4;

      if (!reducedMotion) {
        for (let i = 0; i < EMBER_COUNT; i++) {
          emberPos[i * 3] += Math.sin(time * 2 + i) * 0.003;
          emberPos[i * 3 + 1] += emberRise[i] * delta;
          emberPos[i * 3 + 2] += Math.cos(time * 2 + i) * 0.003;
          if (emberPos[i * 3 + 1] > 4.2) {
            emberPos[i * 3] = (Math.random() - 0.5) * 5.2;
            emberPos[i * 3 + 1] = -0.4;
            emberPos[i * 3 + 2] = (Math.random() - 0.5) * 5.2;
          }
        }
        emberGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  if (failed) {
    return (
      <div className="relative size-full">
        <Image
          src={images.burrata}
          alt="Burrata pizza with a pesto swirl"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive 3D wood-fired Margherita pizza. Drag or use the arrow keys to rotate."
      tabIndex={0}
      onKeyDown={(e) => {
        const step = 0.25;
        if (e.key === "ArrowLeft") rotateBy.current(-step, 0);
        else if (e.key === "ArrowRight") rotateBy.current(step, 0);
        else if (e.key === "ArrowUp") rotateBy.current(0, -step * 0.6);
        else if (e.key === "ArrowDown") rotateBy.current(0, step * 0.6);
        else return;
        e.preventDefault();
      }}
      className="size-full cursor-grab touch-pan-y active:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
