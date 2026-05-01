export function toCanonicalPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";

  let normalized = pathname.replace(/\/index\.html$/, "/");
  normalized = normalized.replace(/\.html$/, "");

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/, "");
  }

  return normalized || "/";
}

export function toCanonicalUrl(
  pathname: string,
  site?: URL | string,
): string {
  const canonicalPath = toCanonicalPath(pathname);
  if (!site) return canonicalPath;
  return new URL(canonicalPath, site).toString();
}
