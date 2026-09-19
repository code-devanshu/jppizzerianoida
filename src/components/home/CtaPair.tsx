"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow } from "@/components/zine/icons";
import { CircleButton } from "@/components/zine/CircleButton";
import { dishes } from "@/data/menu";

const rotation = ["margherita", "burrata", "pesto"]
  .map((id) => dishes.find((d) => d.id === id)!)
  .filter(Boolean);

function Dots({ tone }: { tone: string }) {
  return (
    <>
      {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((c) => (
        <span key={c} aria-hidden className={`absolute size-2.5 rounded-full ${tone} ${c}`} />
      ))}
    </>
  );
}

export function CtaPair({ heading = "The Box of Fire.", eyebrow = "Fresh from the oven" }: { heading?: string; eyebrow?: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((cur) => (cur + d + rotation.length) % rotation.length);
  const dish = rotation[i];

  return (
    <section className="mx-auto grid max-w-[1600px] gap-5 px-6 pb-24 sm:px-10 sm:pb-32 lg:grid-cols-2">
      <div className="relative flex min-h-[460px] flex-col justify-between gap-10 rounded-3xl bg-butter p-8 sm:p-12">
        <Dots tone="bg-ink" />
        <div className="mt-6">
          <span className="script text-2xl text-accent">{eyebrow}</span>
          <h2 className="display mt-2 text-[clamp(3.5rem,8vw,7.5rem)]">{heading}</h2>
          <p className="mt-4 max-w-md text-lg">Order takeaway, or book a table at our Sector 104 café. Open Tuesday to Sunday, 2 PM to midnight.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CircleButton href="/booking">Get Your Pizza</CircleButton>
          <CircleButton href="/menu">Explore Pizzas</CircleButton>
        </div>
      </div>

      <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-3xl bg-ink p-8 text-paper" data-invert>
        <Dots tone="bg-paper" />
        <div key={dish.id} className="animate-pop relative aspect-square w-[min(70%,380px)] overflow-hidden rounded-full border-4 border-paper">
          <Image src={dish.image!} alt={dish.alt ?? dish.name} fill sizes="380px" className="object-cover" />
        </div>
        <p className="display absolute inset-x-0 bottom-6 text-center text-3xl">{dish.name}</p>
        {(["left", "right"] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d === "left" ? "Previous pizza" : "Next pizza"}
            onClick={() => go(d === "left" ? -1 : 1)}
            className={`absolute top-1/2 grid size-16 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink transition duration-300 active:scale-90 hover:bg-accent hover:text-paper ${d === "left" ? "left-5" : "right-5"}`}
          >
            <Arrow dir={d} className="size-7" />
          </button>
        ))}
      </div>
    </section>
  );
}
