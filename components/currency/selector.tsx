"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { defaultCurrencies, type CurrencyCode } from "@/lib/currencies";
import { useCurrency } from "./provider";
import { ChevronDownIcon, CoinIcon } from "@/components/icons";

export function CurrencySelector({ dict }: { dict: Dictionary }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.currencyUI.label}
        className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      >
        <CoinIcon width={16} height={16} />
        {currency}
        <ChevronDownIcon width={12} height={12} />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900">
          {defaultCurrencies
            .filter((c) => c.enabled)
            .map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code as CurrencyCode);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-start text-sm hover:bg-slate-50 dark:hover:bg-white/5 ${
                  c.code === currency
                    ? "font-semibold text-brand-900 dark:text-brand-300"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {c.code} <span className="text-slate-400 dark:text-slate-500">{c.symbol}</span>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
