const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix public assets when the site is hosted below a repository path. */
export function publicPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
