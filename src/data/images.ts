const photo = (n: number) => `/photos/jp-${String(n).padStart(2, "0")}.jpg`;

/** Real photos of JP Pizzeria Noida (Sector 104 café), keyed by what they show. */
export const images = {
  // pizzas
  margherita: photo(11),
  burrata: photo(20),
  pesto: photo(7),
  pestoSwirl: photo(24),
  charredCrust: photo(13),
  veggiePizza: photo(17),
  pepperPizza: photo(19),
  garlicBread: photo(18),
  burrataStudio: photo(15),
  // café
  oven: photo(22),
  cafeSign: photo(5),
  cafeGarden: photo(21),
  cafeHall: photo(6),
  // menus & signage
  menuCard: photo(3),
  neapolitanPoster: photo(10),
} as const;
