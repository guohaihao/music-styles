import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import "./globals.css";
import { formatDimensionLabel, getDimensions } from "@/lib/styles";

export const metadata: Metadata = {
  title: "JMP Style Atlas",
  description: "A Next.js showcase of Billboard style clusters across melody, harmony, rhythm, and timbre."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dimensions = getDimensions();

  return (
    <html lang="en">
      <body className="stage-shell">
        <div className="stage-backdrop">
          <div className="stage-scrim" />
          <div className="stage-orb stage-orb-left" />
          <div className="stage-orb stage-orb-right" />
          <div className="stage-orb stage-orb-floor" />
          <div className="stage-band" />
        </div>
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="glass-panel mb-8 rounded-[28px] border border-line px-5 py-4 shadow-panel sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Link href="/" className="max-w-xl">
                <p className="font-display text-2xl tracking-tight text-ink">JMP Style Atlas</p>
                <p className="mt-1 text-sm text-muted">
                  Billboard patterns across melody, harmony, rhythm, and timbre from 1958 to 2017.
                </p>
              </Link>
              <nav className="flex flex-wrap gap-2">
                {dimensions.map((dimension) => (
                  <Link
                    key={dimension}
                    href={`/${dimension}` as Route}
                    className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-ink"
                  >
                    {formatDimensionLabel(dimension)}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
