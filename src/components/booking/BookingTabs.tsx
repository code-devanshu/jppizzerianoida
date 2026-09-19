"use client";

import { useState } from "react";
import { Soup, UtensilsCrossed } from "lucide-react";
import { ReserveFlow } from "./ReserveFlow";
import { TakeawayFlow } from "./TakeawayFlow";

const tabs = [
  { id: "reserve", label: "Book a Table", note: "Dine-In", Icon: UtensilsCrossed },
  { id: "takeaway", label: "Order Takeaway", note: "Pickup", Icon: Soup },
] as const;

export function BookingTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("reserve");

  return (
    <div className="space-y-12">
      <div role="tablist" aria-label="Booking type" className="grid grid-cols-2 gap-2 rounded-full border border-ink/15 bg-white/60 p-1.5 sm:max-w-xl">
        {tabs.map(({ id, label, note, Icon }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-full px-3 py-3 transition sm:flex-row sm:gap-2 ${
                on ? "bg-ink text-paper" : "text-ink/65 hover:bg-ink/10"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-title-sm font-semibold">{label}</span>
              <span className="text-label-sm uppercase opacity-70">• {note}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="panel-reserve" aria-labelledby="tab-reserve" hidden={tab !== "reserve"}>
        <ReserveFlow />
      </div>
      <div role="tabpanel" id="panel-takeaway" aria-labelledby="tab-takeaway" hidden={tab !== "takeaway"}>
        <TakeawayFlow />
      </div>
    </div>
  );
}
