import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Field({ label, error, id, ...props }: Props) {
  const fieldId = id ?? `f-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-label-sm uppercase text-ink/65">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-err` : undefined}
        {...props}
        className={`h-12 rounded border bg-white px-4 text-body-md text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 ${
          error
            ? "border-[#b3261e] focus:border-[#b3261e] focus:ring-[#b3261e]/25"
            : "border-ink/15 focus:border-accent focus:ring-accent/25"
        }`}
      />
      {error && (
        <p id={`${fieldId}-err`} role="alert" className="text-body-sm text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}
