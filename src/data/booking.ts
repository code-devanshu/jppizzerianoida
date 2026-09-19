import { images } from "./images";

/** Café hours are 2:00 PM to 11:59 PM, Tuesday to Sunday. */
export const afternoonSlots = [
  { time: "14:00" },
  { time: "14:30" },
  { time: "15:00" },
  { time: "15:30" },
  { time: "16:00" },
  { time: "16:30" },
] as const;

export const eveningSlots = [
  { time: "18:00" },
  { time: "19:00" },
  { time: "20:00", peak: true },
  { time: "20:30", peak: true },
  { time: "21:00" },
  { time: "22:00" },
  { time: "22:30" },
  { time: "23:00" },
] as const;

export const CLOSED_WEEKDAY = 1; // Monday

export const takeawayMenu = [
  {
    id: "margherita",
    name: "Classic Margherita",
    tag: "Most loved",
    blurb: "48-hour sourdough, scratch-made tomato sauce, wood-fired.",
    price: 449,
    image: images.margherita,
    alt: "Margherita with basil on a wood-fired crust",
  },
  {
    id: "burrata",
    name: "Burrata Pizza",
    tag: "Creamy",
    blurb: "Wood-fired sourdough base finished with creamy burrata.",
    price: 649,
    image: images.burrata,
    alt: "Burrata pizza with a pesto swirl",
  },
  {
    id: "pesto",
    name: "Pesto Pizza",
    tag: "Green & fresh",
    blurb: "Pesto-based pizza on our 48-hour sourdough.",
    price: 549,
    image: images.pesto,
    alt: "Pesto pizza with burrata and cherry tomatoes",
  },
] as const;

export const reheatSteps = [
  { n: "01. Skillet", t: "Cast-Iron Skillet • 2 Min", d: "Heat a dry skillet on medium-high. Place a slice for 90 to 120 seconds to re-crisp the base." },
  { n: "02. Steam", t: "Lid & a Drop of Water", d: "Add two drops of water beside the slice and cover for 30 seconds so the cheese softens again." },
  { n: "03. Olive Oil", t: "A Raw Drizzle", d: "Finish with a little olive oil over the blisters right before serving." },
] as const;
