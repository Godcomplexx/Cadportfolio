import { cloudflare } from "@cloudflare/vite-plugin";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vinext from "vinext";

export default defineConfig(() => {
  const localPreview = process.env.LOCAL_PREVIEW === "1";

  return {
    resolve: localPreview
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
        external: localPreview ? [] : ["cloudflare:workers"],
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
