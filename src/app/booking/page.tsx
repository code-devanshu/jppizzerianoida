import type { Metadata } from "next";
import { CtaPair } from "@/components/home/CtaPair";
import { BookingTabs } from "@/components/booking/BookingTabs";

export const metadata: Metadata = {
  title: "Table Booking & Takeaway",
  description:
    "Book a table at our Sector 104 café or order wood-fired Neapolitan pizza for takeaway. Open Tuesday to Sunday, 2 PM to midnight.",
};

export default function BookingPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-6 pb-12 pt-32 sm:px-10">
        <span className="script text-2xl text-accent">wood-fired in Sector 104</span>
        <h1 className="display mt-2 text-[clamp(4rem,11vw,10rem)]">Seats &amp; slices</h1>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-2xl text-lg text-ink/70">
            Reserve a table at our Sector 104 café, or order blistered wood-fired pies to take home. Booking ahead is recommended, especially on weekends.
          </p>
          <div className="flex items-center gap-3 self-start rounded-full bg-butter px-5 py-3 lg:self-auto">
            <span className="size-2.5 animate-pulse rounded-full bg-accent" />
            <span className="script text-xl">Tue–Sun · 2 PM – 11:59 PM · Closed Mondays</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10">
        <BookingTabs />
      </section>

      <div className="pt-8">
        <CtaPair />
      </div>
    </>
  );
}
