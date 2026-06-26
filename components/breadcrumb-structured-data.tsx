import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { type Locale } from "@/i18n/routing";
import { getBreadcrumbStructuredData } from "@/lib/structured-data";

type BreadcrumbStructuredDataProps = {
  locale: Locale;
  path: `/${string}` | "/";
  titleNamespace: string;
};

export async function BreadcrumbStructuredData({
  locale,
  path,
  titleNamespace,
}: BreadcrumbStructuredDataProps) {
  if (path === "/") return null;

  const t = await getTranslations({ locale, namespace: titleNamespace });

  const data = getBreadcrumbStructuredData({
    locale,
    path,
    title: t("title"),
  });

  return <JsonLd data={data} />;
}