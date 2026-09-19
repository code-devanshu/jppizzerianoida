export const site = {
  name: "JP Pizzeria",
  city: "Noida",
  tagline: "Neapolitan ~ Naples in Noida",
  description:
    "Family-run wood-fired Neapolitan pizza in Noida. 48-hour sourdough, sauces made from scratch and a leopard-spotted crust. Dine in at our Sector 104 café, order takeaway or book a table.",
  phone: "+91 98703 20025",
  phoneTel: "+919870320025",
  whatsapp: "https://wa.me/919870320025",
  instagram: { handle: "@jppizzerianoida", url: "https://www.instagram.com/jppizzerianoida/" },
  rating: { score: "4.8", count: 41, source: "Google" },
  opened: "7 July 2026",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/heritage", label: "Our Story" },
  { href: "/booking", label: "Table Booking & Takeaway" },
] as const;

export const locations = [
  {
    name: "Sector 104 Café",
    badge: "Dine-in · Takeaway",
    lines: ["Gali No. 3, Hazipur, Sector 104", "Noida, Uttar Pradesh 201304"],
    hours: "Tue – Sun, 2:00 PM – 11:59 PM · Closed Mondays",
    price: "₹400–800 per person",
    map: "https://maps.google.com/?q=28.537069,77.365067",
  },
  {
    name: "Sector 76 Pizza Cart",
    badge: "Where it began",
    lines: ["Opposite back gate, Aditya Celebrity Homes", "Near Amrapali Silicon City, Sector 76, Noida 201301"],
    hours: "Opens 6:00 PM daily",
    price: "₹400–600 per person",
    map: "https://www.google.com/maps/search/?api=1&query=JP+Pizzeria+Sector+76+Noida",
  },
] as const;

/** Sector 104 café. Monday is closed, so reservations skip it. */
export const hours = [
  { days: "Tuesday – Sunday", time: "2:00 PM – 11:59 PM" },
  { days: "Monday", time: "Closed" },
] as const;

/** Fullscreen menu and footer links. */
export const megaLinks = [
  { href: "/", label: "Home" },
  { href: "/heritage", label: "Story" },
  { href: "/menu", label: "Pizzas" },
  { href: "/booking", label: "Order" },
  { href: "/#contact", label: "Contact" },
] as const;
