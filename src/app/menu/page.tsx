import type { Metadata } from "next";
import { CtaPair } from "@/components/home/CtaPair";
import { MenuExperience } from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: "Pizzas & Menu",
  description:
    "Wood-fired Neapolitan pizzas on 48-hour sourdough, plus garlic bread and tiramisu, from JP Pizzeria in Noida.",
};

export default function MenuPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-32 sm:px-10">
        <span className="script text-2xl text-accent">wood-fired, made from scratch</span>
        <h1 className="display mt-2 text-[clamp(4rem,11vw,10rem)]">Fresh from the fire</h1>
        <p className="mt-6 max-w-2xl text-lg text-ink/70">
          Neapolitan pizza from a wood-fired oven, on sourdough that ferments for 48 hours. Sauces are made from
          scratch, never from a can.
        </p>
      </section>
      <MenuExperience />
      <div className="pt-20">
        <CtaPair />
      </div>
    </>
  );
}
