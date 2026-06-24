import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { type Locale } from "@/i18n/routing";
import { getStructuredData } from "@/lib/structured-data";

type StructuredDataProps = {
  locale: Locale;
};

export async function StructuredData({ locale }: StructuredDataProps) {
  const t = await getTranslations({ locale, namespace: "metadata.site" });

  const data = getStructuredData({
    locale,
    description: t("description"),
    jobTitle: t("title"),
  });

  return <JsonLd data={data} />;
}