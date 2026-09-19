import { images } from "./images";

export type MenuCategory = "pizzas" | "sides" | "desserts";

export const menuFilters: { id: "all" | MenuCategory; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "pizzas", label: "Wood-Fired Pizzas" },
  { id: "sides", label: "Sides" },
  { id: "desserts", label: "Desserts" },
];

export type Dish = {
  id: string;
  category: MenuCategory;
  name: string;
  stamp: string;
  /** Rupees. PLACEHOLDER: the client has not supplied a price list yet. */
  price: number;
  description: string;
  tags: [string, string];
  image?: string;
  alt?: string;
};

/*
 * Dishes come from customer reviews and the owner's Instagram. The client has not sent a priced menu,
 * so every `price` below is a placeholder inside the ₹400–800 per-person range and must be replaced.
 */
export const dishes: Dish[] = [
  {
    id: "margherita",
    category: "pizzas",
    name: "Classic Margherita",
    stamp: "Most loved",
    price: 449,
    description:
      "The pie regulars keep coming back for. 48-hour sourdough, a from-scratch tomato sauce and a wood-fired, leopard-spotted crust.",
    tags: ["48H Sourdough", "Scratch-Made Sauce"],
    image: images.margherita,
    alt: "Margherita pizza with basil on a blistered wood-fired crust",
  },
  {
    id: "burrata",
    category: "pizzas",
    name: "Burrata Pizza",
    stamp: "Creamy",
    price: 649,
    description: "Our wood-fired sourdough base finished with creamy burrata.",
    tags: ["Burrata", "Wood-Fired"],
    image: images.burrata,
    alt: "Burrata pizza topped with a whole burrata, pesto swirl and basil",
  },
  {
    id: "pesto",
    category: "pizzas",
    name: "Pesto Pizza",
    stamp: "Green & fresh",
    price: 549,
    description: "A pesto-based pizza on the same 48-hour sourdough, fired in the wood oven.",
    tags: ["Pesto", "48H Sourdough"],
    image: images.pesto,
    alt: "Pesto pizza with burrata, cherry tomatoes and basil",
  },
  {
    id: "chicken-garlic-bread",
    category: "sides",
    name: "Chicken Garlic Bread",
    stamp: "Guest favourite",
    price: 249,
    description: "Garlic bread loaded with chicken. Reviewers call it excellent.",
    tags: ["Chicken", "Garlic"],
  },
  {
    id: "garlic-butter-bread",
    category: "sides",
    name: "Garlic Butter Bread",
    stamp: "Side",
    price: 199,
    description: "Warm, buttery garlic bread to go with your pie.",
    tags: ["Garlic", "Butter"],
    image: images.garlicBread,
    alt: "Cheesy garlic bread on a wooden board",
  },
  {
    id: "tiramisu",
    category: "desserts",
    name: "Tiramisu",
    stamp: "Dessert",
    price: 299,
    description: "A classic Italian finish to the meal.",
    tags: ["Italian Classic", "Sweet"],
  },
];
