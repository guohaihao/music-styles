import { StyleTimeline } from "@/components/style-timeline";
import { getDimensionTheme } from "@/lib/styles";
import type { CuratorStyleNote, Dimension, StyleRecord } from "@/lib/types";

type StyleShowcaseProps = {
  curatorNotes: Record<string, CuratorStyleNote>;
  dimension: Dimension;
  styles: StyleRecord[];
};

export function StyleShowcase({ curatorNotes, dimension, styles }: StyleShowcaseProps) {
  const theme = getDimensionTheme(dimension);

  return (
    <div className="space-y-8">
      {styles.map((style) => {
        const note = curatorNotes[String(style.style_id)];
        const songCount = style.timeline.reduce((count, entry) => count + entry.songs.length, 0);
        const badge = note?.badge || `${style.year_range.start} to ${style.year_range.end}`;
        const summary = note?.z_summary || style.auto_description;
        const manualDescription =
          note?.manual_description ||
          style.manual_description ||
          "Add curator notes to the generated JSON to replace this placeholder.";

        return (
          <section
            key={style.style_id}
            className="glass-panel relative overflow-hidden rounded-[32px] border border-line p-6 shadow-panel sm:p-7"
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme.accentBar}`} />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <p className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${theme.accentSoft} ${theme.accentBorder} ${theme.accentText}`}>
                    Style {style.style_id}
                  </p>
                  <p className="text-sm text-muted">
                    {songCount} songs from {style.year_range.start} to {style.year_range.end}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-3xl tracking-tight text-ink">{badge}</h3>
                <p className="mt-4 text-base leading-7 text-muted">{summary}</p>
              </div>

              <div className={`w-full max-w-lg rounded-[28px] border border-dashed bg-white/80 p-5 ${theme.accentBorder}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Manual Description</p>
                <p className="mt-3 text-sm leading-6 text-muted">{manualDescription}</p>
              </div>
            </div>

            <div className="mt-8">
              <StyleTimeline
                accentBar={theme.accentBar}
                accentBorder={theme.accentBorder}
                accentSoft={theme.accentSoft}
                accentSolid={theme.accentSolid}
                accentText={theme.accentText}
                styleId={style.style_id}
                timeline={style.timeline}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
