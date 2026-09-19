import Image from "next/image";
import { CircleButton } from "@/components/zine/CircleButton";
import { WordReveal } from "@/components/zine/WordReveal";
import { images } from "@/data/images";

const shots = [
  { src: images.oven, alt: "The wood-fired oven and pizzaiolo at work", cap: "the wood oven", cls: "left-0 top-6 -rotate-6 z-10" },
  { src: images.burrata, alt: "Overhead of a burrata pizza", cap: "straight from the fire", cls: "left-[28%] top-24 rotate-3 z-20" },
  { src: images.charredCrust, alt: "Wood-fired pizza with a charred, leopard-spotted crust", cap: "leopard-spotted", cls: "left-[52%] top-0 rotate-[9deg] z-10" },
] as const;

export function Polaroids({ title = "You deserve the best for your table", body = "Every pie starts with sourdough that ferments for 48 hours, and a sauce made from scratch, never from a can. Fired in a wood oven and served warm, with a lot of joy." }: { title?: string; body?: string }) {
  return (
    <section className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:py-36">
      <div className="space-y-8">
        <WordReveal as="h2" text={title} className="display text-[clamp(3rem,7vw,6.5rem)]" />
        <WordReveal text={body} className="max-w-xl text-xl leading-snug" />
        <CircleButton href="/booking">Get Your Pizza</CircleButton>
      </div>
      <div className="relative mx-auto h-[420px] w-full max-w-[640px] sm:h-[520px]">
        {shots.map((s) => (
          <figure
            key={s.cap}
            className={`absolute w-[46%] bg-paper p-3 pb-10 shadow-[0_14px_30px_rgba(28,22,19,.28)] outline outline-1 outline-ink/10 transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:z-30 hover:rotate-0 hover:scale-105 ${s.cls}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
            </div>
            <figcaption className="script absolute inset-x-0 bottom-2 text-center text-lg italic">{s.cap}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
