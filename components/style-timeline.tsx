"use client";

import { useState } from "react";

import { SongPreviewRow } from "@/components/song-preview-row";
import type { TimelineYear } from "@/lib/types";

type StyleTimelineProps = {
  accentBar: string;
  accentBorder: string;
  accentSoft: string;
  accentSolid: string;
  accentText: string;
  styleId: number;
  timeline: TimelineYear[];
};

export function StyleTimeline({
  accentBar,
  accentBorder,
  accentSoft,
  accentSolid,
  accentText,
  styleId,
  timeline
}: StyleTimelineProps) {
  const [activeYear, setActiveYear] = useState<number>(timeline[0]?.year ?? 0);

  if (timeline.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-white/50 p-4 text-sm text-muted">
        No timeline entries available for style {styleId}.
      </div>
    );
  }

  const activeEntry = timeline.find((entry) => entry.year === activeYear) ?? timeline[0];

  return (
    <div className="rounded-[28px] border border-line bg-[rgba(248,251,255,0.88)] p-4">
      <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${accentBar}`} />
      <div className="flex gap-3 overflow-x-auto pb-3">
        {timeline.map((entry) => {
          const isActive = entry.year === activeEntry.year;
          return (
            <button
              key={entry.year}
              type="button"
              onClick={() => setActiveYear(entry.year)}
              className={`min-w-fit rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? `${accentSolid} border-transparent text-white shadow-sm`
                  : `bg-white/90 text-muted hover:text-ink ${accentBorder}`
              }`}
            >
              {entry.year}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 rounded-3xl border bg-white/85 p-4 ${accentBorder}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Selected Year</p>
            <h4 className="font-display text-2xl text-ink">{activeEntry.year}</h4>
          </div>
          <p className={`rounded-full border px-3 py-1 text-sm ${accentSoft} ${accentBorder} ${accentText}`}>
            {activeEntry.songs.length} representative songs
          </p>
        </div>

        <div className="space-y-4">
          {activeEntry.songs.map((song) => (
            <SongPreviewRow
              accentBorder={accentBorder}
              accentSoft={accentSoft}
              accentText={accentText}
              key={`${activeEntry.year}-${song.song_title}-${song.performer}`}
              song={song}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
