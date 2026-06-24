import { routing, type Locale } from "@/i18n/routing";

export function getLocalizedPath(
  path: `/${string}` | "/" | string,
  locale: Locale | string
) {
  if (locale === routing.defaultLocale) {
    return path === "/" ? "" : path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function getLocalizedUrl(
  path: `/${string}` | "/" | string,
  locale: Locale | string,
  baseUrl: string
) {
  return `${baseUrl}${getLocalizedPath(path, locale)}`;
}