import { access, readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const remoteManifestPath = join(
  repoRoot,
  "apps/remote-app/dist/mf-manifest.json",
);
const hostEntryPath = join(repoRoot, "apps/my-app/dist/hostEntry.js");
const hostSourcePath = join(repoRoot, "apps/my-app/src/App.tsx");
const expectedShared = {
  react: "18.3.1",
  "react-dom": "18.3.1",
  jotai: "2.15.0",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readRequired(path) {
  await access(path);
  return readFile(path, "utf8");
}

async function findText(root, text) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      const match = await findText(path, text);
      if (match) return match;
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;
    if ((await readFile(path, "utf8")).includes(text)) return path;
  }
}

const manifest = JSON.parse(await readRequired(remoteManifestPath));
assert(
  manifest.name === "remoteApp",
  `Unexpected remote name: ${manifest.name}`,
);

const exposeNames = new Set(
  (manifest.exposes ?? []).map((expose) => expose.name),
);
for (const expose of ["App", "count"]) {
  assert(exposeNames.has(expose), `Missing remote expose: ${expose}`);
}

const shared = new Map(
  (manifest.shared ?? []).map((entry) => [entry.name, entry]),
);
for (const [name, version] of Object.entries(expectedShared)) {
  const entry = shared.get(name);
  assert(entry, `Missing shared dependency in manifest: ${name}`);
  assert(
    entry.version === version,
    `Shared ${name} reports ${entry.version}; expected ${version}`,
  );
  assert(
    entry.requiredVersion === `^${version}`,
    `Shared ${name} requires ${entry.requiredVersion}; expected ^${version}`,
  );
}

const hostEntry = await readRequired(hostEntryPath);
assert(
  hostEntry.includes("remoteApp"),
  "Host federation entry does not register remoteApp",
);

const hostSource = await readRequired(hostSourcePath);
assert(
  /import\(["']remoteApp\/App["']\)/.test(hostSource),
  "Host source does not consume remoteApp/App",
);

const hostRemoteChunk = await findText(
  join(repoRoot, "apps/my-app/dist"),
  "remoteApp/App",
);
assert(
  hostRemoteChunk,
  "Built host output does not contain the remoteApp/App consumer",
);

console.log("React Module Federation artifact checks passed.");
console.log(`- manifest: ${relative(repoRoot, remoteManifestPath)}`);
console.log(`- host consumer: ${relative(repoRoot, hostRemoteChunk)}`);

if (process.env.MF_CHECK_HTTP === "1") {
  const remoteBase = process.env.MF_REMOTE_URL ?? "http://127.0.0.1:3200";
  const hostBase = process.env.MF_HOST_URL ?? "http://127.0.0.1:3100";
  for (const [label, url] of [
    ["remote manifest", `${remoteBase}/mf-manifest.json`],
    ["remote entry", `${remoteBase}/remoteEntry.js`],
    ["host page", `${hostBase}/`],
  ]) {
    const response = await fetch(url);
    assert(response.ok, `${label} returned HTTP ${response.status}: ${url}`);
  }
  console.log("React Module Federation HTTP checks passed.");
}
