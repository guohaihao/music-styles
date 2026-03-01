import Link from "next/link";
import type { Route } from "next";

type DimensionCardProps = {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  accentClassName: string;
};

export function DimensionCard({
  href,
  title,
  eyebrow,
  description,
  accentClassName
}: DimensionCardProps) {
  return (
    <Link
      href={href as Route}
      className="group relative overflow-hidden rounded-[28px] border border-line bg-white/85 p-6 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-accent"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1.5 opacity-90 transition duration-300 group-hover:h-2 ${accentClassName}`}
      />
      <p className="text-xs uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl tracking-tight text-ink">{title}</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{description}</p>
      <p className="mt-8 text-sm font-medium text-ink">Explore styles</p>
    </Link>
  );
}
