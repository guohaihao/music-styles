import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const buildScriptPath = path.join(rootDir, "scripts", "build_styles.mjs");

function timestamp() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false
  });
}

function log(message) {
  console.log(`[styles-build ${timestamp()}] ${message}`);
}

log("Rebuild started");

const child = spawn(process.execPath, [buildScriptPath], {
  cwd: rootDir,
  stdio: "inherit"
});

child.on("close", (code) => {
  if (code === 0) {
    log("Rebuild finished successfully");
    process.exit(0);
  }

  log(`Rebuild failed with exit code ${code ?? "unknown"}`);
  process.exit(code ?? 1);
});
