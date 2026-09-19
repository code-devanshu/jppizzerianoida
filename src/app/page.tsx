import { FlavourGrid } from "@/components/home/FlavourGrid";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { PinnedSequence } from "@/components/home/PinnedSequence";
import { Polaroids } from "@/components/home/Polaroids";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaPair } from "@/components/home/CtaPair";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PinnedSequence />
      <Manifesto />
      <FlavourGrid />
      <Polaroids />
      <Testimonials />
      <CtaPair />
    </>
  );
}
