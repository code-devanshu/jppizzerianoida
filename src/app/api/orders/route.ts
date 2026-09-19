import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { referenceCode } from "@/lib/format";
import { takeawayMenu } from "@/data/booking";

type Body = {
  items?: { id: string; qty: number }[];
  name?: string;
  phone?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const errors = validateContact(
    { name: body.name ?? "", phone: body.phone ?? "" },
    { requireEmail: false },
  );
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const lines = (body.items ?? []).filter(
    (i) => Number.isInteger(i.qty) && i.qty > 0 && takeawayMenu.some((m) => m.id === i.id),
  );
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your order is empty." }, { status: 422 });
  }

  // Price is recomputed server-side from the catalogue, never trusted from the client.
  const total = lines.reduce(
    (sum, l) => sum + l.qty * takeawayMenu.find((m) => m.id === l.id)!.price,
    0,
  );

  return NextResponse.json({ reference: referenceCode("JP"), total }, { status: 201 });
}
