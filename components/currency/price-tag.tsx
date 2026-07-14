"use client";

import type { Money } from "@/lib/domain/types";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/format";
import { formatMoneyIn } from "@/lib/currencies";
import { useCurrency } from "./provider";

/** Renders a Money amount converted into the visitor's chosen display currency. */
export function PriceTag({
  money,
  locale,
  className,
}: {
  money: Money;
  locale: Locale;
  className?: string;
}) {
  const { currency } = useCurrency();
  if (currency === money.currency) {
    return <span className={className}>{formatMoney(money, locale)}</span>;
  }
  return <span className={className}>{formatMoneyIn(money, currency, locale)}</span>;
}
