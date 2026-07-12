import type { Locale } from "./i18n/config";
import type { Money } from "./domain/types";

const intlLocale: Record<Locale, string> = {
  fr: "fr-MA",
  ar: "ar-MA",
  en: "en-GB",
  es: "es-ES",
};

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso + (iso.length === 10 ? "T12:00:00Z" : "")));
}

export function formatMoney(money: Money, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
  }).format(money.amount);
}

export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(n);
}
