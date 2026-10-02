/** Public path Traefik routes to this app. No trailing slash. */
export const appBasename = "/app";

/** Browser pathname with the `/app` prefix removed. */
export function pathnameWithinApp(pathname: string): string {
  if (pathname === appBasename || pathname === `${appBasename}/`) return "/";
  if (pathname.startsWith(`${appBasename}/`)) {
    return pathname.slice(appBasename.length) || "/";
  }
  return pathname;
}
