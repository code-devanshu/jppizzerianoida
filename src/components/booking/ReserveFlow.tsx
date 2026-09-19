"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock, Flame, Users, ShieldCheck } from "lucide-react";
import { afternoonSlots, CLOSED_WEEKDAY, eveningSlots } from "@/data/booking";
import { validateContact, type FieldErrors } from "@/lib/validation";
import { ConfirmDialog, type Confirmation } from "./ConfirmDialog";
import { Field } from "./Field";

type Day = { key: string; top: string; day: number; sub: string; full: string };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Next 7 open days (we are closed on Mondays) in English, computed on the client so the page never ships stale dates. */
function buildDays(): Day[] {
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
  const full = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const today = new Date();
  const open: Date[] = [];
  for (let i = 0; open.length < 7; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (d.getDay() !== CLOSED_WEEKDAY) open.push(d);
  }
  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isTomorrow = (d: Date) => d.toDateString() === new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toDateString();
  return open.map((d) => {
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      top: isToday(d) ? "Today" : isTomorrow(d) ? "Tomorrow" : cap(weekday.format(d).replace(".", "")),
      day: d.getDate(),
      sub: cap(weekday.format(d).replace(".", "")),
      full: cap(full.format(d)),
    };
  });
}

function SectionTitle({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display font-semibold uppercase text-headline-md text-accent">{n}</span>
        <h3 className="font-display font-semibold uppercase text-headline-sm text-ink">{title}</h3>
      </div>
      {note && <span className="hidden text-label-sm uppercase text-ink/50 sm:block">{note}</span>}
    </div>
  );
}

const chip = (on: boolean, disabled = false) =>
  `rounded border px-4 py-3 text-title-sm transition ${
    disabled
      ? "cursor-not-allowed border-ink/15 text-ink/35 line-through"
      : on
        ? "border-ink bg-accent text-paper"
        : "border-ink/20 bg-ink/5 text-ink hover:border-ink/40"
  }`;

export function ReserveFlow() {
  const [days, setDays] = useState<Day[]>([]);
  const [dayKey, setDayKey] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("20:00");
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  useEffect(() => {
    const list = buildDays();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dates depend on the visitor's clock, so they can only be built after mount
    setDays(list);
    setDayKey(list[0].key);
  }, []);

  const day = days.find((d) => d.key === dayKey);
  const isEvening = eveningSlots.some((s) => s.time === time);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const found = validateContact(form, { requireEmail: false });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (!day) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: day.key, time, guests, notes, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setConfirmation({
        title: "Table Request Received",
        description: `Thank you ${form.name.split(" ")[0]}. We will call you on the number you gave to confirm your table.`,
        rows: [
          ["Booking Reference", data.reference],
          ["Date & Time", `${day.full} • ${time}`],
          ["Guests", `${guests} ${guests === 1 ? "Guest" : "Guests"}`],
        ],
      });
    } catch {
      setServerError("Connection failed. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-12">
        {/* 01 */}
        <section aria-labelledby="r1">
          <SectionTitle n="01" title="Date & Guests" note="Closed Mondays" />
          <h4 id="r1" className="sr-only">Date and guests</h4>
          <div role="radiogroup" aria-label="Date" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {days.length === 0
              ? Array.from({ length: 7 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-ink/5" />)
              : days.map((d) => {
                  const on = d.key === dayKey;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setDayKey(d.key)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg border py-3 transition ${
                        on
                          ? "border-ink bg-accent text-paper"
                          : "border-ink/20 bg-ink/5 hover:border-ink/40"
                      }`}
                    >
                      <span className="text-label-sm uppercase opacity-80">{d.top}</span>
                      <span className="font-display font-semibold uppercase text-headline-md leading-none">{d.day}</span>
                      <span className="text-label-sm uppercase opacity-70">{d.sub}</span>
                    </button>
                  );
                })}
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-label-md uppercase text-ink/65">Number of Guests</span>
              <span className="font-display font-semibold uppercase text-title-md text-accent" aria-live="polite">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
            </div>
            <div role="radiogroup" aria-label="Number of guests" className="grid grid-cols-6 gap-2 sm:grid-cols-12">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={guests === n}
                  onClick={() => setGuests(n)}
                  className={`h-11 rounded border text-title-sm transition ${
                    guests === n
                      ? "border-ink bg-accent text-paper"
                      : "border-ink/20 bg-ink/5 hover:border-ink/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-3 text-body-sm text-ink/65">
              For groups larger than 12, or catering, call us on +91 98703 20025.
            </p>
          </div>
        </section>

        {/* 03 */}
        <section>
          <SectionTitle n="02" title="Arrival Time" />
          <div className="mb-4 flex flex-wrap gap-4 text-label-sm uppercase text-ink/65">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-accent" /> Busy hours</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-ink/40" /> Standard</span>
          </div>
          <div className="space-y-6">
            {[
              { title: "Afternoon", slots: afternoonSlots },
              { title: "Evening", slots: eveningSlots, note: "Last seating 11:00 PM" },
            ].map((group) => (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-label-md uppercase text-accent">{group.title}</span>
                  {group.note && <span className="hidden text-label-sm uppercase text-ink/50 sm:block">{group.note}</span>}
                </div>
                <div role="radiogroup" aria-label={group.title} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {group.slots.map((s) => {
                    const peak = "peak" in s && s.peak;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        role="radio"
                        aria-checked={time === s.time}
                        onClick={() => setTime(s.time)}
                        className={`relative ${chip(time === s.time)}`}
                      >
                        {s.time}
                        {peak && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 */}
        <section>
          <SectionTitle n="03" title="Special Requests" note="Optional" />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-label-sm uppercase text-ink/65">Notes for the team</label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={400}
              placeholder="Allergies, special occasions or seating preferences..."
              className="rounded border border-ink/15 bg-white p-4 text-body-md text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
            />
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink/15 relative overflow-hidden rounded-2xl bg-white/70 p-6 shadow-[0_18px_40px_-18px_rgba(28,22,19,0.35)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-label-sm uppercase text-accent">Booking Summary</span>
              <span className="font-display font-semibold uppercase text-headline-md text-ink">Your Table at JP Pizzeria</span>
            </div>
            <span className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent"><Flame className="size-5" /></span>
          </div>

          <dl className="space-y-4 text-body-sm">
            {[
              [CalendarDays, "Date & Day", day?.full ?? "—"],
              [Clock, "Arrival", `${time}${isEvening ? " (Evening)" : ""}`],
              [Users, "Party Size", `${guests} ${guests === 1 ? "Person" : "People"}`],
            ].map(([Icon, k, v]) => {
              const I = Icon as typeof Clock;
              return (
                <div key={k as string} className="flex items-start justify-between gap-4 border-b border-ink/15 pb-3">
                  <dt className="flex items-center gap-2 text-ink/65"><I className="size-4 text-accent" />{k as string}</dt>
                  <dd className="text-right text-ink">{v as string}</dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-6 space-y-4">
            <span className="block text-label-md uppercase text-accent">Main Contact Details</span>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field label="Full Name" autoComplete="name" placeholder="Your name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Field label="Mobile number (we will call to confirm)" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Field label="Email (optional)" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="mt-6 flex gap-3 rounded-lg border border-ink/20 bg-ink/5 p-4">
            <ShieldCheck className="size-5 shrink-0 text-accent" />
            <div className="flex flex-col text-body-sm">
              <span className="text-label-md uppercase text-accent">Sector 104 Café</span>
              <span className="text-ink/65">Open Tue–Sun, 2 PM – 11:59 PM. No deposit required. Tables are confirmed by phone.</span>
            </div>
          </div>

          {serverError && <p role="alert" className="mt-4 rounded bg-[#b3261e]/10 p-3 text-body-sm text-[#b3261e]">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting || !day}
            className="mt-6 flex w-full items-center justify-between gap-3 rounded bg-accent px-5 py-4 text-title-md text-paper transition hover:bg-ink active:scale-[0.99] disabled:opacity-60"
          >
            <span>{submitting ? "Sending…" : "Request Table"}</span>
            <ArrowRight className="size-5" />
          </button>
          <span className="mt-3 block text-center text-body-sm text-ink/50">Need to change plans? Call +91 98703 20025.</span>
        </div>

        <div className="border border-ink/15 space-y-1 rounded-2xl bg-white/70 p-5">
          <span className="text-label-md uppercase text-accent">Prefer to talk?</span>
          <p className="text-body-sm text-ink/65">
            Call or WhatsApp <a href="tel:+919870320025" className="text-ink underline underline-offset-4">+91 98703 20025</a>.
            Gali No. 3, Hazipur, Sector 104, Noida.
          </p>
        </div>
      </aside>

      <ConfirmDialog confirmation={confirmation} onClose={() => setConfirmation(null)} />
    </form>
  );
}
