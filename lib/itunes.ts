import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ItunesTrack } from "@/lib/types";

type CacheStore = Record<string, ItunesTrack | null>;

type ItunesApiTrack = {
  previewUrl?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  trackName?: string;
  artistName?: string;
};

type ItunesSearchResponse = {
  resultCount: number;
  results: ItunesApiTrack[];
};

const cachePath = path.join(process.cwd(), "data", "itunes_cache.json");
let cacheWriteQueue = Promise.resolve();
let cacheStorePromise: Promise<CacheStore> | null = null;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function createCacheKey(title: string, performer: string): string {
  return `${normalize(title)}|||${normalize(performer)}`;
}

async function readCache(): Promise<CacheStore> {
  if (cacheStorePromise) {
    return cacheStorePromise;
  }

  cacheStorePromise = (async () => {
    try {
      const content = await readFile(cachePath, "utf8");
      return JSON.parse(content) as CacheStore;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {};
      }
      throw error;
    }
  })();

  return cacheStorePromise;
}

async function writeCache(cache: CacheStore): Promise<void> {
  await mkdir(path.dirname(cachePath), { recursive: true });
  cacheWriteQueue = cacheWriteQueue.then(() =>
    writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8")
  );
  await cacheWriteQueue;
}

function scoreTrack(track: ItunesApiTrack, title: string, performer: string): number {
  const normalizedTitle = normalize(title);
  const normalizedPerformer = normalize(performer);
  const trackTitle = normalize(track.trackName ?? "");
  const trackArtist = normalize(track.artistName ?? "");
  let score = 0;

  if (trackTitle === normalizedTitle) {
    score += 120;
  } else if (trackTitle.includes(normalizedTitle) || normalizedTitle.includes(trackTitle)) {
    score += 75;
  }

  if (trackArtist === normalizedPerformer) {
    score += 120;
  } else if (trackArtist.includes(normalizedPerformer) || normalizedPerformer.includes(trackArtist)) {
    score += 75;
  }

  for (const token of normalizedTitle.split(" ")) {
    if (token && trackTitle.includes(token)) {
      score += 6;
    }
  }

  for (const token of normalizedPerformer.split(" ")) {
    if (token && trackArtist.includes(token)) {
      score += 6;
    }
  }

  if (track.previewUrl) {
    score += 15;
  }

  if (track.artworkUrl100) {
    score += 5;
  }

  return score;
}

function toTrackPayload(track: ItunesApiTrack | null): ItunesTrack | null {
  if (!track) {
    return null;
  }

  return {
    previewUrl: track.previewUrl ?? null,
    artworkUrl100: track.artworkUrl100 ?? null,
    trackViewUrl: track.trackViewUrl ?? null,
    trackName: track.trackName ?? null,
    artistName: track.artistName ?? null
  };
}

export async function findItunesTrack(title: string, performer: string): Promise<ItunesTrack | null> {
  const cache = await readCache();
  const cacheKey = createCacheKey(title, performer);

  if (cacheKey in cache) {
    return cache[cacheKey];
  }

  const term = encodeURIComponent(`${title} ${performer}`);
  const response = await fetch(
    `https://itunes.apple.com/search?media=music&entity=musicTrack&limit=10&term=${term}`,
    {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`iTunes search failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ItunesSearchResponse;
  const bestTrack =
    payload.results
      ?.map((track) => ({
        track,
        score: scoreTrack(track, title, performer)
      }))
      .sort((a, b) => b.score - a.score)[0]?.track ?? null;

  const result = toTrackPayload(bestTrack);
  cache[cacheKey] = result;
  await writeCache(cache);
  return result;
}
