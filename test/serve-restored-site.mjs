import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number.parseInt(process.env.PORT ?? "4175", 10);
const HOST = "127.0.0.1";
const TEST_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.join(TEST_ROOT, "haoqi.design");
const BLOG_ROOT = path.join(TEST_ROOT, "mysite2026-blog-cyn6.vercel.app");

const routeFiles = new Map([
  ["/", "index.html"],
  ["/reunimos", "reunimos.html"],
  ["/inspire_mono", "inspire_mono.html"],
  ["/wasm_design_utils", "wasm_design_utils.html"],
  ["/adrive", "adrive.html"],
  ["/shore_icon", "shore_icon.html"],
  ["/teambition", "teambition.html"],
]);

const localNavigationScript = String.raw`
<script data-local-mirror-router>
(() => {
  const routes = new Set([
    "/",
    "/reunimos",
    "/inspire_mono",
    "/wasm_design_utils",
    "/adrive",
    "/shore_icon",
    "/teambition"
  ]);

  document.addEventListener("click", (event) => {
    const element = event.target instanceof Element ? event.target : null;
    const link = element?.closest("a");
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const url = new URL(href, window.location.href);
    const route = url.pathname.replace(/\/+$/, "") || "/";
    if (url.origin !== window.location.origin || !routes.has(route)) return;

    const currentRoute = window.location.pathname.replace(/\/+$/, "") || "/";
    if (route === currentRoute && url.hash) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(route + url.search + url.hash);
  }, true);
})();
</script>`;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".otf": "font/otf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".zip": "application/zip",
};

function safePath(root, relativePath) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, relativePath);
  if (resolved !== resolvedRoot && !resolved.startsWith(`${resolvedRoot}${path.sep}`)) {
    return null;
  }
  return resolved;
}

function injectLocalSupport(html) {
  return html
    .replaceAll(
      "https://mysite2026-blog-cyn6.vercel.app/",
      "/mysite2026-blog-cyn6.vercel.app/",
    )
    .replace("</body>", `${localNavigationScript}</body>`);
}

async function sendFile(response, filePath, injectHtml = false) {
  const fileStats = await stat(filePath);
  if (!fileStats.isFile()) throw new Error("Not a file");

  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] ?? "application/octet-stream";
  let body = await readFile(filePath);

  if (injectHtml && extension === ".html") {
    body = Buffer.from(injectLocalSupport(body.toString("utf8")), "utf8");
  }

  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Content-Length": body.length,
    "Content-Type": contentType,
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? "/", `http://${HOST}:${PORT}`);
    let pathname = decodeURIComponent(requestUrl.pathname);
    pathname = pathname.replaceAll("\\", "/");

    if (requestUrl.searchParams.has("_rsc")) {
      response.writeHead(204, {
        "Cache-Control": "no-store",
        "Content-Type": "text/x-component",
      });
      response.end();
      return;
    }

    const normalizedRoute = pathname.replace(/\/+$/, "") || "/";
    const routeFile = routeFiles.get(normalizedRoute);
    if (routeFile) {
      await sendFile(response, path.join(SITE_ROOT, routeFile), true);
      return;
    }

    const blogPrefix = "/mysite2026-blog-cyn6.vercel.app/";
    if (pathname.startsWith(blogPrefix)) {
      const blogPath = safePath(BLOG_ROOT, pathname.slice(blogPrefix.length));
      if (!blogPath) throw new Error("Invalid path");
      await sendFile(response, blogPath);
      return;
    }

    const staticPath = safePath(SITE_ROOT, pathname.replace(/^\/+/, ""));
    if (!staticPath) throw new Error("Invalid path");
    await sendFile(response, staticPath);
  } catch {
    const body = Buffer.from("404 — local mirror file not found", "utf8");
    response.writeHead(404, {
      "Cache-Control": "no-store",
      "Content-Length": body.length,
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end(body);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Restored site: http://${HOST}:${PORT}/`);
  console.log("Press Ctrl+C to stop.");
});
