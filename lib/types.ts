export type Dimension = "melody" | "harmony" | "rhythm" | "timbre";

export type TimelineSong = {
  song_title: string;
  performer: string;
};

export type ItunesTrack = {
  previewUrl: string | null;
  artworkUrl100: string | null;
  trackViewUrl: string | null;
  trackName: string | null;
  artistName: string | null;
};

export type TimelineYear = {
  year: number;
  songs: TimelineSong[];
};

export type StyleRecord = {
  style_id: number;
  year_range: {
    start: number;
    end: number;
  };
  timeline: TimelineYear[];
  auto_description: string;
  manual_description: string;
};

export type CuratorStyleNote = {
  badge?: string;
  signature?: string;
  z_summary?: string;
  manual_description?: string;
};

export type CuratorNotes = Partial<Record<Dimension, Record<string, CuratorStyleNote>>>;
