import id from "@/content/portfolio-id.json";
import en from "@/content/portfolio-en.json";
import zh from "@/content/portfolio-zh.json";
import type { Locale } from "@/i18n/routing";

export const catalogs = { id, en, zh };
export type Product = (typeof id.products)[number];
export type ProductStatus = Product["status"];
export const productIds = id.products.map((product) => product.id);
export function getProduct(locale: Locale, slug: string) {
  return catalogs[locale].products.find((product) => product.id === slug);
}
export const images: Record<string,string> = {
  "ida-gen3":"ida", "ida-labs":"labs", "proqpay-lite":"proqpay",
  "proqtrack":"proqtrack", "arah-fleet":"arah",
  "msg":"msg", "perada-group":"perada", "danawangsa":"danawangsa",
  "ida-search":"ida-search",
  "ida-4b":"ida-4b",
  "hr-pay-manual":"hr-pay",
  "pay-hr":"pay-hr",
  "nusadata":"nusadata",
  "proqpay-ess":"proqpay-ess",
  "proqacc":"proqacc",
  "kawankas":"kawankas",

};
