import type { Money } from "./domain/types";
import type { Locale } from "./i18n/config";

export type CurrencyCode = "MAD" | "EUR" | "USD" | "XOF";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  /** Demo static rate: 1 unit of this currency = N MAD. */
  rateToMad: number;
  enabled: boolean;
}

/** Static demo rates — an admin can edit these on /admin/currencies. */
export const defaultCurrencies: Currency[] = [
  { code: "MAD", symbol: "MAD", rateToMad: 1, enabled: true },
  { code: "EUR", symbol: "€", rateToMad: 10.85, enabled: true },
  { code: "USD", symbol: "$", rateToMad: 9.95, enabled: true },
  { code: "XOF", symbol: "CFA", rateToMad: 0.0165, enabled: true },
];

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode, rates: Currency[]): number {
  if (from === to) return amount;
  const fromRate = rates.find((r) => r.code === from)?.rateToMad ?? 1;
  const toRate = rates.find((r) => r.code === to)?.rateToMad ?? 1;
  const mad = amount * fromRate;
  return mad / toRate;
}

const intlLocale: Record<Locale, string> = {
  fr: "fr-MA",
  ar: "ar-MA",
  en: "en-GB",
  es: "es-ES",
};

/** Formats a Money value converted into the target display currency. */
export function formatMoneyIn(
  money: Money,
  target: CurrencyCode,
  locale: Locale,
  rates: Currency[] = defaultCurrencies,
): string {
  const amount = convert(money.amount, money.currency as CurrencyCode, target, rates);
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: target,
    maximumFractionDigits: target === "XOF" ? 0 : amount < 100 ? 2 : 0,
  }).format(amount);
}
