import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

const root = process.cwd();
const outputDirectory = resolve(root, "dist", ".openai");
const hostingConfig = resolve(root, ".openai", "hosting.json");
const migrations = resolve(root, "drizzle");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));

if (await exists(migrations)) {
  await cp(migrations, resolve(outputDirectory, "drizzle"), {
    recursive: true,
  });
}
