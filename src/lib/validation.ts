export type ContactFields = { name: string; phone: string; email?: string };
export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(
  { name, phone, email }: ContactFields,
  { requireEmail }: { requireEmail: boolean },
): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) errors.name = "Please enter a valid name.";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a valid phone number.";
  if (requireEmail && !EMAIL.test((email ?? "").trim())) errors.email = "Please enter a valid email address.";
  return errors;
}
