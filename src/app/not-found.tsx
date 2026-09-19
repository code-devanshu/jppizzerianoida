import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-5 py-24 text-center">
      <div className="max-w-lg space-y-5">
        <Flame className="mx-auto size-10 text-ember" />
        <span className="block text-label-md uppercase text-primary-container">Error 404</span>
        <h1 className="font-headline text-headline-lg text-farina">This batch is already sold out.</h1>
        <p className="text-body-lg text-on-surface-variant">
          The page you are looking for has left the hearth. Return to the pizzeria and pick
          something fresh from the oven.
        </p>
        <Link href="/" className="inline-block rounded bg-primary-container px-6 py-3.5 text-title-sm text-basalt transition hover:bg-[#e8b665]">
          Back to the Oven
        </Link>
      </div>
    </section>
  );
}
