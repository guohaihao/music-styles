import path from "node:path";
import { fileURLToPath } from "node:url";

import nodemon from "nodemon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const medoidsDir = path.join(rootDir, "Medoids");
const loggedBuildScript = path.join(rootDir, "scripts", "build_styles_logged.mjs");

function timestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false
  });
}

function log(message) {
  console.log(`[styles-watch ${timestamp()}] ${message}`);
}

nodemon({
  script: loggedBuildScript,
  exec: process.execPath,
  watch: [medoidsDir],
  ext: "csv",
  delay: "500",
  stdout: false,
  runOnChangeOnly: false,
  signal: "SIGTERM"
});

nodemon.on("start", () => {
  log(`Watching ${path.relative(rootDir, medoidsDir)} for CSV changes`);
});

nodemon.on("restart", (files) => {
  const changedFiles =
    files?.map((filePath) => path.relative(rootDir, filePath)).join(", ") || "unknown file";
  log(`Change detected: ${changedFiles}`);
});

nodemon.on("stdout", (data) => {
  process.stdout.write(data);
});

nodemon.on("stderr", (data) => {
  process.stderr.write(data);
});

nodemon.on("quit", () => {
  log("Shutting down watcher");
  process.exit();
});

nodemon.on("crash", () => {
  log("Rebuild failed; watcher is still running and will retry on the next CSV change");
});
