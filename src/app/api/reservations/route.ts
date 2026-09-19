import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
import { referenceCode } from "@/lib/format";

type Body = {
  date?: string;
  time?: string;
  guests?: number;
  notes?: string;
  name?: string;
  phone?: string;
  email?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const errors = validateContact(
    { name: body.name ?? "", phone: body.phone ?? "", email: body.email ?? "" },
    { requireEmail: false },
  );
  if (body.date && new Date(`${body.date}T12:00:00`).getDay() === 1) {
    return NextResponse.json({ error: "We are closed on Mondays. Please choose another day." }, { status: 422 });
  }
  if (!body.date || !body.time) {
    return NextResponse.json({ error: "Choose a date and time." }, { status: 422 });
  }
  if (!Number.isInteger(body.guests) || body.guests! < 1 || body.guests! > 12) {
    return NextResponse.json({ error: "Guests must be between 1 and 12." }, { status: 422 });
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // No persistence layer yet: acknowledge the request with a booking reference.
  return NextResponse.json({ reference: referenceCode("JP") }, { status: 201 });
}
