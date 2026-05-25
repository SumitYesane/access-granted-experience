import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const distServerDir = resolve("dist/server");
const indexEntry = resolve(distServerDir, "index.js");
const previewEntry = resolve(distServerDir, "server.js");

if (!existsSync(indexEntry)) {
  console.warn("[fix-preview-server-entry] Skipping: dist/server/index.js was not found.");
  process.exit(0);
}

if (!existsSync(dirname(previewEntry))) {
  mkdirSync(dirname(previewEntry), { recursive: true });
}

const indexSource = readFileSync(indexEntry, "utf8");
const previewSource = `export { default } from "./index.js";\n`;

if (existsSync(previewEntry)) {
  const current = readFileSync(previewEntry, "utf8");
  if (current === previewSource || current === indexSource) {
    process.exit(0);
  }
}

writeFileSync(previewEntry, previewSource, "utf8");
console.log("[fix-preview-server-entry] Wrote dist/server/server.js");
