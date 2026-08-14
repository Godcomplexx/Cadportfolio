import { cloudflare } from "@cloudflare/vite-plugin";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig(() => {
  const localPreview = process.env.LOCAL_PREVIEW === "1";
  const githubPages = process.env.GITHUB_PAGES === "1";
  const browserOnlyBuild = localPreview || githubPages;

  return {
    base: githubPages ? "/Cadportfolio/" : undefined,
    resolve: browserOnlyBuild
      ? {
          alias: {
            "cloudflare:workers": resolve(
              process.cwd(),
              "lib/cloudflare-workers-preview.ts",
            ),
          },
        }
      : undefined,
    build: {
      rolldownOptions: {
        external: browserOnlyBuild ? [] : ["cloudflare:workers"],
      },
    },
    plugins: localPreview
      ? [vinext()]
      : [
          vinext(),
          cloudflare({
            viteEnvironment: {
              name: "rsc",
              childEnvironments: ["ssr"],
            },
          }),
        ],
  };
});
