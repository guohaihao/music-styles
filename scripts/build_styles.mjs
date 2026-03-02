import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const medoidsDir = path.join(rootDir, "Medoids");
const outputDir = path.join(rootDir, "data");

const DIMENSIONS = ["melody", "harmony", "rhythm", "timbre"];

const EXCLUDED_FEATURES = new Set([
  "",
  "bucket_year",
  "cluster_id",
  "intra_sd",
  "cluster_size",
  "song_title",
  "performer",
  "style_id",
  "is_representative",
  "major",
  "is_new_style"
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(value);
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value !== "" || row.length > 0) {
    row.push(value);
    if (row.length > 1 || row[0] !== "") {
      rows.push(row);
    }
  }

  return rows;
}

function toRecord(headers, row) {
  return headers.reduce((record, header, index) => {
    record[header] = row[index] ?? "";
    return record;
  }, {});
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function humanizeFeatureName(name) {
  return name
    .replaceAll("_", " ")
    .replace(/\bpct\b/gi, "percentage")
    .replace(/\bmean\b/gi, "mean")
    .replace(/\bioi\b/gi, "IOI")
    .replace(/\bbpm\b/gi, "BPM")
    .replace(/\bext\b/gi, "extended")
    .replace(/\bnonbasic\b/gi, "non-basic")
    .replace(/\bany\b/gi, "any")
    .replace(/\bavg\b/gi, "average");
}

function describeFeatureDelta(item) {
  const sign = item.delta >= 0 ? "+" : "-";
  return `${humanizeFeatureName(item.feature)} (${sign}${Math.abs(item.delta).toFixed(2)})`;
}

function summarizeDescription(styleId, highs, lows) {
  if (highs.length > 0 && lows.length > 0) {
    return `Style ${styleId} shows higher-than-average ${highs
      .map(describeFeatureDelta)
      .join(", ")} and lower-than-average ${lows.map(describeFeatureDelta).join(", ")}.`;
  }

  if (highs.length > 0) {
    return `Style ${styleId} shows higher-than-average ${highs
      .map(describeFeatureDelta)
      .join(", ")}.`;
  }

  if (lows.length > 0) {
    return `Style ${styleId} shows lower-than-average ${lows.map(describeFeatureDelta).join(", ")}.`;
  }

  return `Style ${styleId} tracks close to the full dimension average.`;
}

function buildTimeline(rows) {
  const years = new Map();

  for (const row of rows) {
    const year = Number(row.bucket_year);
    if (!Number.isFinite(year)) {
      continue;
    }
    if (!years.has(year)) {
      years.set(year, []);
    }
    years.get(year).push(row);
  }

  return Array.from(years.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearRows]) => {
      const representatives = yearRows.filter((row) => Number(row.is_representative) === 1);
      const chosenRows = (representatives.length > 0 ? representatives : yearRows).slice(0, 3);

      return {
        year,
        songs: chosenRows.map((row) => ({
          song_title: row.song_title,
          performer: row.performer
        }))
      };
    });
}

function computeFeatureStats(rows, featureColumns) {
  const totals = Object.fromEntries(featureColumns.map((feature) => [feature, 0]));
  const counts = Object.fromEntries(featureColumns.map((feature) => [feature, 0]));

  for (const row of rows) {
    for (const feature of featureColumns) {
      const value = toNumber(row[feature]);
      if (value === null) {
        continue;
      }
      totals[feature] += value;
      counts[feature] += 1;
    }
  }

  return Object.fromEntries(
    featureColumns.map((feature) => [
      feature,
      counts[feature] === 0 ? 0 : totals[feature] / counts[feature]
    ])
  );
}

async function resolveDimensionSourceFile(dimension) {
  const entries = await readdir(medoidsDir);
  const matches = entries.filter((entry) =>
    new RegExp(`^rep_vectors_${dimension}-.+\\.csv$`, "i").test(entry)
  );

  if (matches.length === 0) {
    throw new Error(`No CSV found for dimension "${dimension}" in ${medoidsDir}.`);
  }

  const rankedMatches = await Promise.all(
    matches.map(async (fileName) => {
      const filePath = path.join(medoidsDir, fileName);
      const fileStat = await stat(filePath);
      return {
        fileName,
        modifiedAtMs: fileStat.mtimeMs
      };
    })
  );

  rankedMatches.sort((a, b) => b.modifiedAtMs - a.modifiedAtMs || a.fileName.localeCompare(b.fileName));
  return rankedMatches[0].fileName;
}

async function buildDimension(dimension) {
  const fileName = await resolveDimensionSourceFile(dimension);
  const sourcePath = path.join(medoidsDir, fileName);
  const csvText = await readFile(sourcePath, "utf8");
  const [headers, ...records] = parseCsv(csvText);
  const dataRows = records.map((row) => toRecord(headers, row));
  const featureColumns = headers
    .filter((header) => !EXCLUDED_FEATURES.has(header))
    .filter((header) => dataRows.some((row) => toNumber(row[header]) !== null));
  const globalMeans = computeFeatureStats(dataRows, featureColumns);
  const styles = new Map();

  for (const row of dataRows) {
    const styleId = String(row.style_id);
    if (!styles.has(styleId)) {
      styles.set(styleId, []);
    }
    styles.get(styleId).push(row);
  }

  const stylePayload = Array.from(styles.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([styleId, rows]) => {
      const years = rows.map((row) => Number(row.bucket_year)).filter(Number.isFinite);
      const styleMeans = computeFeatureStats(rows, featureColumns);
      const deltas = featureColumns
        .map((feature) => ({
          feature,
          delta: styleMeans[feature] - globalMeans[feature]
        }));

      const highs = deltas
        .filter((item) => item.delta > 0)
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 3);
      const lows = deltas
        .filter((item) => item.delta < 0)
        .sort((a, b) => a.delta - b.delta)
        .slice(0, 3);

      return {
        style_id: Number(styleId),
        year_range: {
          start: Math.min(...years),
          end: Math.max(...years)
        },
        timeline: buildTimeline(rows),
        auto_description: summarizeDescription(styleId, highs, lows),
        manual_description: ""
      };
    });

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, `styles_${dimension}.json`),
    `${JSON.stringify(stylePayload, null, 2)}\n`,
    "utf8"
  );

  return fileName;
}

async function main() {
  const builtFiles = await Promise.all(
    DIMENSIONS.map(async (dimension) => ({
      dimension,
      fileName: await buildDimension(dimension)
    }))
  );
  for (const { dimension, fileName } of builtFiles) {
    console.log(`Built ${dimension} from ${fileName}`);
  }
  console.log("Built style JSON files in ./data");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
