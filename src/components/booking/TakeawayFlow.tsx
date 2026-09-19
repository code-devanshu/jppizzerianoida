"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BookOpen, Bolt, Minus, PackageOpen, Plus, ShoppingBag, MapPin, Timer } from "lucide-react";
import { CLOSED_WEEKDAY, reheatSteps, takeawayMenu } from "@/data/booking";
import { inr } from "@/lib/format";
import { validateContact, type FieldErrors } from "@/lib/validation";
import { ConfirmDialog, type Confirmation } from "./ConfirmDialog";
import { Field } from "./Field";

export function TakeawayFlow() {
  const [qty, setQty] = useState<Record<string, number>>({ margherita: 1, burrata: 0, pesto: 0 });
  const [form, setForm] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [eta, setEta] = useState("—");

  useEffect(() => {
    // Open Tuesday to Sunday, 2:00 PM to 11:59 PM. Pickup timing is confirmed by phone, so only show open/closed.
    const now = new Date();
    const open = now.getDay() !== CLOSED_WEEKDAY && now.getHours() >= 14;
    const next = new Date(now);
    if (now.getHours() >= 14 || now.getDay() === CLOSED_WEEKDAY) next.setDate(next.getDate() + 1);
    if (next.getDay() === CLOSED_WEEKDAY) next.setDate(next.getDate() + 1);
    const day = next.toDateString() === now.toDateString() ? "today" : next.toLocaleDateString("en-IN", { weekday: "long" });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open/closed depends on the visitor's clock, so it is computed after mount
    setEta(open ? "Open now" : `Opens ${day} 2:00 PM`);
  }, []);

  const lines = takeawayMenu.filter((m) => qty[m.id] > 0);
  const total = lines.reduce((s, m) => s + m.price * qty[m.id], 0);

  const change = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(12, q[id] + delta)) }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const found = validateContact(form, { requireEmail: false });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (lines.length === 0) {
      setServerError("Add at least one pizza to your order.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((m) => ({ id: m.id, qty: qty[m.id] })), ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setConfirmation({
        title: "Order Received",
        description: `Thank you ${form.name.split(" ")[0]}. We'll call you on the number you gave when your pizza is ready.`,
        rows: [
          ["Order Reference", data.reference],
          ["Total", inr(data.total)],
          ["Café status", eta],
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
      <div className="space-y-8">
        <div className="border border-ink/15 flex flex-col justify-between gap-4 rounded-2xl bg-white/70 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-accent/15 text-accent"><Timer className="size-7" /></span>
            <div>
              <span className="flex flex-wrap gap-x-3 text-label-sm uppercase text-accent">
                <span>Takeaway</span><span className="text-ink/50">Sector 104 Café</span>
              </span>
              <h3 className="font-display font-semibold uppercase text-headline-md text-ink">Pick Up Fresh From the Oven</h3>
            </div>
          </div>
          <div className="flex flex-col sm:items-end">
            <span className="text-label-sm uppercase text-ink/50">Café status</span>
            <span className="font-display font-semibold uppercase text-headline-sm text-accent">{eta}</span>
          </div>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <h3 className="font-display font-semibold uppercase text-headline-md text-ink">Wood-Fired Pizzas to Go</h3>
            <span className="text-label-sm uppercase text-ink/50">Confirm timing by phone</span>
          </div>
          <ul className="space-y-4">
            {takeawayMenu.map((m) => (
              <li key={m.id} className="border border-ink/15 flex flex-col gap-4 rounded-2xl bg-white/70 p-4 sm:flex-row sm:items-center">
                <div className="photo-vignette relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:w-36">
                  <Image src={m.image} alt={m.alt} fill sizes="(min-width: 640px) 144px, 92vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-x-3">
                    <span className="font-display font-semibold uppercase text-headline-sm text-ink">{m.name}</span>
                    <span className="rounded border border-ink/20 px-2 py-0.5 text-label-sm uppercase text-accent">{m.tag}</span>
                  </div>
                  <p className="text-body-sm text-ink/65">{m.blurb}</p>
                  <span className="text-title-md text-accent">{inr(m.price)}</span>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center" role="group" aria-label={`Quantity ${m.name}`}>
                  <button type="button" aria-label={`Remove one ${m.name}`} onClick={() => change(m.id, -1)} className="grid size-10 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-accent/10"><Minus className="size-4" /></button>
                  <span className="w-6 text-center font-display font-semibold uppercase text-headline-sm text-ink" aria-live="polite">{qty[m.id]}</span>
                  <button type="button" aria-label={`Add one ${m.name}`} onClick={() => change(m.id, 1)} className="grid size-10 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-accent/10"><Plus className="size-4" /></button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-4 rounded-lg border border-ink/20 bg-ink/5 p-5">
            <PackageOpen className="size-6 shrink-0 text-accent" />
            <div>
              <span className="block text-title-sm text-ink">Best eaten fresh</span>
              <p className="text-body-sm text-ink/65">
                Neapolitan pizza is at its best in the first few minutes. Plan to eat soon after pickup, or use the reheating tips below.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-ink/15 rounded-2xl bg-white/70 p-6 lg:p-8">
          <div className="mb-3 flex items-center gap-2 text-label-md uppercase text-accent"><BookOpen className="size-4" /> Reheating Guide</div>
          <h3 className="font-display font-semibold uppercase text-headline-md text-ink">How to Revive the Perfect Crust at Home</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {reheatSteps.map((s) => (
              <div key={s.n} className="space-y-1.5">
                <span className="text-label-md uppercase text-accent">{s.n}</span>
                <span className="block font-display font-semibold uppercase text-title-md text-ink">{s.t}</span>
                <p className="text-body-sm text-ink/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink/15 relative overflow-hidden rounded-2xl bg-white/70 p-6 shadow-[0_18px_40px_-18px_rgba(28,22,19,0.35)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-label-sm uppercase text-accent">Takeaway</span>
              <span className="font-display font-semibold uppercase text-headline-md text-ink">Your Order</span>
            </div>
            <span className="grid size-11 place-items-center rounded-full bg-accent/15 text-accent"><ShoppingBag className="size-5" /></span>
          </div>

          <ul className="space-y-3 text-body-sm">
            {lines.length === 0 && <li className="text-ink/65">Your order is empty.</li>}
            {lines.map((m) => (
              <li key={m.id} className="flex justify-between gap-4">
                <span className="text-ink/65">{qty[m.id]}x {m.name}</span>
                <span className="text-ink">{inr(m.price * qty[m.id])}</span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 border-t border-ink/15 pt-4">
              <span className="text-label-md uppercase text-ink/50">Order Total</span>
              <span className="font-display font-semibold uppercase text-headline-md text-accent" aria-live="polite">{inr(total)}</span>
            </li>
          </ul>

          <div className="mt-6 space-y-4">
            <span className="block text-label-md uppercase text-accent">Who is collecting?</span>
            <Field label="Name for the order" autoComplete="name" placeholder="Your name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Field label="Phone number" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          {serverError && <p role="alert" className="mt-4 rounded bg-[#b3261e]/10 p-3 text-body-sm text-[#b3261e]">{serverError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-between gap-3 rounded bg-accent px-5 py-4 text-title-md text-paper transition hover:bg-ink active:scale-[0.99] disabled:opacity-60"
          >
            <span>{submitting ? "Sending…" : `Send Order (${inr(total)})`}</span>
            <Bolt className="size-5" />
          </button>
          <span className="mt-3 block text-center text-body-sm text-ink/50">Pay at the counter when you collect.</span>
        </div>

        <div className="border border-ink/15 space-y-4 rounded-2xl bg-white/70 p-6">
          <div className="flex flex-col">
            <span className="text-label-sm uppercase text-accent">Pickup Point • Sector 104, Noida</span>
            <span className="font-display font-semibold uppercase text-headline-sm text-ink">Gali No. 3, Hazipur</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-ink/5 p-4 text-body-sm text-ink/65">
            <MapPin className="size-5 shrink-0 text-accent" /> Gali No. 3, Hazipur, Sector 104, Noida 201304 · Tue–Sun 2 PM – 11:59 PM
          </div>
          <div className="grid grid-cols-2 gap-3 text-body-sm text-ink/65">
            <a href="tel:+919870320025" className="flex items-center gap-2 hover:text-accent"><Timer className="size-4 text-accent" /> Call +91 98703 20025</a>
            <a href="https://maps.google.com/?q=28.537069,77.365067" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent"><MapPin className="size-4 text-accent" /> Open in Maps</a>
          </div>
        </div>
      </aside>

      <ConfirmDialog confirmation={confirmation} onClose={() => setConfirmation(null)} />
    </form>
  );
}
