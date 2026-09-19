import Link from "next/link";
import { hours, locations, megaLinks, site } from "@/data/site";
import { Branch, PizzaIcon } from "./icons";
import { Scallop } from "./Scallop";
import { SliceGame } from "./SliceGame";
import { WaveText } from "./WaveText";

export function Footer() {
  return (
    <div className="relative bg-paper">
      <Scallop />
      <footer id="contact" data-invert className="relative -mt-px overflow-hidden bg-ink text-paper">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 pt-14 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <PizzaIcon className="size-14 shrink-0 text-butter [--pz-dot:var(--color-ink)]" />
            <div>
              <p className="display text-2xl text-butter">JP Pizzeria Noida</p>
              <p className="script mt-1 text-3xl leading-tight text-paper">
                Slow-Proofed, Never Rushed.
                <br />
                Fired Hot, Eaten Warm.
              </p>
            </div>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2 text-xl text-paper lg:pt-3">
            {megaLinks.map((l) => (
              <Link key={l.href} href={l.href} className="display text-2xl tracking-wide transition-colors duration-300 hover:text-accent">
                <WaveText text={l.label === "Story" ? "Our Story" : l.label} />
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative mx-auto mt-4 h-[clamp(420px,74vh,760px)] max-w-[1600px]">
          <Branch className="pointer-events-none absolute -left-20 bottom-0 h-[115%] -rotate-[14deg] text-butter/70 sm:-left-8" />
          <Branch className="pointer-events-none absolute -right-20 bottom-0 h-[115%] rotate-[14deg] -scale-x-100 text-butter/70 sm:-right-8" />
          <p
            aria-label={site.name}
            className="display pointer-events-none absolute inset-x-0 top-[56%] -translate-y-1/2 select-none text-center text-[clamp(4.5rem,19vw,20rem)] uppercase leading-[0.85] text-butter"
          >
            JP
            <br className="sm:hidden" />
            <span className="sm:ml-[0.2em]">Pizzeria</span>
          </p>
          <SliceGame />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-6 sm:px-8">
          <div className="grid gap-8 rounded-[2rem] bg-paper p-6 text-[15px] text-ink sm:p-10 md:grid-cols-3">
            <div>
              <p className="script text-3xl text-accent">{locations[0].name}</p>
              <p className="mt-2 text-ink/75">
                {locations[0].lines.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </p>
              <a href={locations[0].map} target="_blank" rel="noreferrer" className="mt-2 inline-block underline underline-offset-4 hover:text-accent">
                Get directions
              </a>
            </div>
            <div>
              <p className="script text-3xl text-accent">Opening hours</p>
              <ul className="mt-2 space-y-1 text-ink/75">
                {hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-6 whitespace-nowrap md:max-w-[20rem]">
                    <span>{h.days}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="script text-3xl text-accent">Call, WhatsApp, DM</p>
              <ul className="mt-2 space-y-1 text-ink/75">
                <li><a href={`tel:${site.phoneTel}`} className="hover:text-accent">{site.phone}</a></li>
                <li><a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-accent">WhatsApp us</a></li>
                <li><a href={site.instagram.url} target="_blank" rel="noreferrer" className="hover:text-accent">Instagram {site.instagram.handle}</a></li>
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-4 flex max-w-[60rem] flex-col items-center justify-between gap-1 rounded-full bg-butter px-8 py-4 text-sm text-ink sm:flex-row sm:text-base">
            <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <span className="script text-xl">Naples in Noida · Made under the fire</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
