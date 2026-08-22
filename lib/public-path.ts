const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_PAGES === "1" ? "/Cadportfolio" : "");

/** Prefix public assets when the site is hosted below a repository path. */
export function publicPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
