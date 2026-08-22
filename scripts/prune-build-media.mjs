import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const clientMedia = resolve(process.cwd(), "dist", "client", "media");
const cadHero = resolve(clientMedia, "cad-hero");

// These are local working exports kept in /public for iteration and excluded
// from Git. Vite copies the entire public directory, so remove only their
// generated dist copies before packaging a local deployment.
const generatedOnlyTargets = [
  resolve(cadHero, "EXPORT.md"),
  resolve(cadHero, "cad-hero.glb"),
  resolve(cadHero, "cube_tv.glb"),
  resolve(cadHero, "portfolio-terminal.glb"),
  resolve(cadHero, "render"),
  resolve(cadHero, "render0001-0250.mp4"),
  resolve(cadHero, "screen.webp"),
  resolve(cadHero, "textures"),
  resolve(clientMedia, "cover"),
  resolve(clientMedia, "models"),
  resolve(clientMedia, "music-player-frog.webp"),
];

for (const target of generatedOnlyTargets) {
  await rm(target, { recursive: true, force: true });
}

try {
  const entries = await readdir(cadHero, { withFileTypes: true });
  const unusedAlphaExports = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.startsWith("alpha") &&
      entry.name.endsWith(".webm"),
  );

  for (const entry of unusedAlphaExports) {
    await rm(resolve(cadHero, entry.name), { force: true });
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
