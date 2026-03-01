"use client";

import { useEffect, useState } from "react";

import type { ItunesTrack, TimelineSong } from "@/lib/types";

type SongPreviewRowProps = {
  accentBorder: string;
  accentSoft: string;
  accentText: string;
  song: TimelineSong;
};

type RequestState = {
  loading: boolean;
  data: ItunesTrack | null;
};

function isItunesTrack(payload: unknown): payload is ItunesTrack | null {
  if (payload === null) {
    return true;
  }

  if (!payload || typeof payload !== "object") {
    return false;
  }

  return "previewUrl" in payload;
}

export function SongPreviewRow({ accentBorder, accentSoft, accentText, song }: SongPreviewRowProps) {
  const [state, setState] = useState<RequestState>({
    loading: true,
    data: null
  });

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams({
      title: song.song_title,
      performer: song.performer
    });

    async function loadPreview() {
      try {
        const response = await fetch(`/api/itunes-search?${params.toString()}`);
        const payload = (await response.json()) as unknown;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !isItunesTrack(payload)) {
          setState({ loading: false, data: null });
          return;
        }

        setState({ loading: false, data: payload });
      } catch {
        if (isMounted) {
          setState({ loading: false, data: null });
        }
      }
    }

    setState({ loading: true, data: null });
    loadPreview();

    return () => {
      isMounted = false;
    };
  }, [song.performer, song.song_title]);

  const track = state.data;
  const displayTitle = track?.trackName || song.song_title;
  const displayArtist = track?.artistName || song.performer;

  return (
    <article className={`rounded-3xl border bg-white/90 p-4 shadow-sm ${accentBorder}`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className={`h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white ${accentBorder}`}>
          {track?.artworkUrl100 ? (
            <img
              src={track.artworkUrl100}
              alt={`${displayTitle} artwork`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center px-3 text-center text-xs uppercase tracking-[0.2em] ${accentSoft} text-muted`}>
              {state.loading ? "Loading art" : "No artwork"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-lg font-medium text-ink">{displayTitle}</p>
              <p className="text-sm text-muted">{displayArtist}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${accentSoft} ${accentBorder} ${accentText}`}>
              30 sec preview
            </span>
          </div>
          <div className="mb-3 mt-3 h-px w-full bg-line" />
          <audio controls preload="none" className="w-full" src={track?.previewUrl ?? undefined} />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            {track?.trackViewUrl ? (
              <a
                href={track.trackViewUrl}
                target="_blank"
                rel="noreferrer"
                className={`font-medium underline decoration-2 underline-offset-4 ${accentText}`}
              >
                Open in Apple Music/iTunes
              </a>
            ) : (
              <span className="text-muted">{state.loading ? "Searching Apple preview..." : "No Apple link found"}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
