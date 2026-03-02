import { notFound } from "next/navigation";

import { StyleShowcase } from "@/components/style-showcase";
import { formatDimensionLabel, getCuratorNotes, getDimensionTheme, getDimensions, getStylesForDimension } from "@/lib/styles";
import type { Dimension } from "@/lib/types";

export const dynamic = "force-dynamic";

const DATA_SOURCE_COPY: Record<Dimension, string> = {
  melody: "1958–2017 Billboard songs · Vocal stems.\nGuo, Seetharaman & Xie (2026).",
  rhythm: "1958–2017 Billboard songs · Drum stems.\nGuo, Seetharaman & Xie (2026).",
  harmony: "1958–2017 Billboard songs · Accompaniment stems.\nGuo, Seetharaman & Xie (2026).",
  timbre: "1958–2017 Billboard songs · Full-track audio.\nGuo, Seetharaman & Xie (2026)."
};

type DimensionPageProps = {
  params: Promise<{
    dimension: string;
  }>;
};

export async function generateStaticParams() {
  return getDimensions().map((dimension) => ({ dimension }));
}

export default async function DimensionPage({ params }: DimensionPageProps) {
  const { dimension } = await params;

  if (!getDimensions().includes(dimension as Dimension)) {
    notFound();
  }

  const typedDimension = dimension as Dimension;
  const [styles, curatorNotes] = await Promise.all([
    getStylesForDimension(typedDimension),
    getCuratorNotes()
  ]);
  const label = formatDimensionLabel(typedDimension);
  const theme = getDimensionTheme(typedDimension);
  const dimensionCuratorNotes = curatorNotes[typedDimension] ?? {};
  const dataSourceCopy = DATA_SOURCE_COPY[typedDimension];

  return (
    <main className="space-y-8">
      <section className={`relative overflow-hidden rounded-[36px] border border-line bg-gradient-to-br px-6 py-8 shadow-panel sm:px-8 ${theme.heroGlow}`}>
        <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${theme.accentBar}`} />
        <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
        <div className="relative mt-2 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className={`text-xs uppercase tracking-[0.32em] ${theme.accentText}`}>{label} Dimension</p>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-ink sm:text-6xl">{label} styles</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              {theme.eyebrow}. Browse clustered style signatures, open year buckets, and preview representative songs
              without leaving the page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className={`rounded-full border px-4 py-2 text-sm ${theme.accentSoft} ${theme.accentBorder} ${theme.accentText}`}>
                {styles.length} styles
              </span>
              <span className="rounded-full border border-line bg-white/75 px-4 py-2 text-sm text-muted">
                Click a year to expand songs
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-1">
            <div className={`rounded-[28px] border bg-white/80 px-5 py-4 ${theme.accentBorder}`}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Count</p>
              <p className="mt-2 font-display text-4xl text-ink">{styles.length}</p>
            </div>
            <div className="rounded-[28px] border border-line bg-white/72 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Data Source</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{dataSourceCopy}</p>
            </div>
          </div>
        </div>
      </section>

      <StyleShowcase
        curatorNotes={dimensionCuratorNotes}
        dimension={typedDimension}
        styles={styles}
      />
    </main>
  );
}
