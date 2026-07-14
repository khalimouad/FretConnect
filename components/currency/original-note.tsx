"use client";

import type { Money } from "@/lib/domain/types";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { useCurrency } from "./provider";

/** Shows the original-currency price only when the display currency differs. */
export function OriginalPriceNote({
  money,
  locale,
  dict,
}: {
  money: Money;
  locale: Locale;
  dict: Dictionary;
}) {
  const { currency } = useCurrency();
  if (currency === money.currency) return null;
  return (
    <p className="mt-1 text-end text-xs text-slate-400 dark:text-slate-500">
      {dict.currencyUI.original}: {formatMoney(money, locale)}
    </p>
  );
}
