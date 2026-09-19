import type { Metadata } from "next";
import Image from "next/image";
import { CtaPair } from "@/components/home/CtaPair";
import { Polaroids } from "@/components/home/Polaroids";
import { CookieToast } from "@/components/story/CookieToast";
import { StoryCarousel } from "@/components/story/StoryCarousel";
import { WordReveal } from "@/components/zine/WordReveal";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From a wood-fired pizza cart in Sector 76 to our Sector 104 café: the story of JP Pizzeria, 48-hour sourdough and scratch-made sauces.",
};

function ClipHeadline({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="clip-l" style={{ ["--i" as string]: i }}>
          <span>{ch === " " ? " " : ch}</span>
        </span>
      ))}
    </span>
  );
}

export default function HeritagePage() {
  return (
    <>
      <section className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-6 pb-16 pt-32 sm:px-10 lg:pl-16">
          <h1 className="display text-[clamp(4.5rem,11vw,10.5rem)]">
            <ClipHeadline text="Pure fire" />
            <br />
            <ClipHeadline text="& flour..." />
          </h1>
          <WordReveal
            text="Family-run, wood-fired and made from scratch. This is how a small pizza cart in Sector 76 grew into a café in Sector 104."
            className="max-w-md text-lg leading-snug"
          />
        </div>
        <div className="relative min-h-[50svh]">
          <Image src={images.cafeSign} alt="Inside the JP Pizzeria café in Sector 104, with the wood-fired oven behind the counter" fill priority sizes="50vw" className="object-cover" />
        </div>
      </section>

      <StoryCarousel />
      <Polaroids title="Made by hands you can meet" body="JP Pizzeria is a family-run pizzeria. Come by, watch the dough get stretched, and say hello to whoever is at the fire." />
      <CtaPair />
      <CookieToast />
    </>
  );
}
