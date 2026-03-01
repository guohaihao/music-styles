import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="glass-panel rounded-[32px] border border-line px-6 py-10 shadow-panel sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Not Found</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight text-ink">This dimension does not exist.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        Use the main navigation to return to one of the four available dimensions.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-accent"
      >
        Back home
      </Link>
    </main>
  );
}
