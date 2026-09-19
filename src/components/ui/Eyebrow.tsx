import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block text-label-md uppercase text-primary-container ${className}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-2xl space-y-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-headline text-headline-lg text-farina md:text-display-lg">{title}</h2>
      </div>
      {children && <p className="max-w-md text-body-lg text-on-surface-variant">{children}</p>}
    </div>
  );
}
