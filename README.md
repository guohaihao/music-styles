# JMP Style Atlas

A clean showcase website built with Next.js, TypeScript, and Tailwind CSS for browsing style clusters derived from Billboard song data.

## Data pipeline

The build script reads these four CSV files from [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/Medoids`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/Medoids):

- `rep_vectors_melody-1112-v1.csv`
- `rep_vectors_harmony-1112-v1.csv`
- `rep_vectors_rhythm-1112-v1.csv`
- `rep_vectors_timbre-1112-v1.csv`

Running `npm run build:styles` generates:

- [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_melody.json`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_melody.json)
- [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_harmony.json`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_harmony.json)
- [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_rhythm.json`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_rhythm.json)
- [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_timbre.json`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/styles_timbre.json)
- [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/itunes_cache.json`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/data/itunes_cache.json) for Apple preview lookup caching

Each generated style record includes:

- `style_id`
- `year_range`
- `timeline` with up to 3 representative songs per year
- `auto_description`
- `manual_description`

## Run locally

```bash
npm install
npm run build:styles
npm run dev
```

Then open `http://localhost:3000`.

## Development auto-update

- `npm run dev` starts both the CSV watcher and the Next.js dev server.
- Any `*.csv` change inside [`/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/Medoids`](/Users/haihaoguo/Downloads/Agent-Codex/Music-GenAI/JMP-Website/Medoids) automatically regenerates the `data/styles_*.json` files.
- Rebuild logs include the changed file, rebuild start, and rebuild finish.
- CSV rename-replace flows are covered because the watcher listens to all file events, not just in-place edits.
- Refresh the browser after a rebuild to see updated data; the dimension pages are forced dynamic so they re-read JSON without restarting the dev server.

If you want only the watcher:

```bash
npm run dev:watch
```

## Notes

- `manual_description` is left empty in the generated JSON so it can be edited later by hand.
- The year-level song list uses `/api/itunes-search` to fetch Apple preview metadata without downloading full tracks.
- iTunes search results are cached locally in `./data/itunes_cache.json` to avoid repeated API calls for the same song and performer pair.
- During development, replacing or editing CSVs in `./Medoids` automatically rebuilds the JSON consumed by the site.
