export const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
export const surcharge = (value: number) => (value > 0 ? `+${inr(value)}` : "Included");

export function referenceCode(prefix: string) {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `#${prefix}-${n}`;
}
