"use client";

import type { Dictionary } from "@/lib/i18n";
import { defaultCurrencies, type CurrencyCode } from "@/lib/currencies";
import { useCurrency } from "@/components/currency/provider";
import { Card } from "@/components/ui";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import { useEffect, useState } from "react";

type ThemePref = "light" | "dark" | "system";

/** Theme + currency preference cards, shared by every settings page. */
export function PreferencesSection({ dict }: { dict: Dictionary }) {
  const { currency, setCurrency } = useCurrency();
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    setPref((localStorage.getItem("theme") as ThemePref | null) ?? "system");
  }, []);

  function applyTheme(next: ThemePref) {
    setPref(next);
    localStorage.setItem("theme", next);
    const dark =
      next === "dark" ||
      (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  const themeOptions: { value: ThemePref; label: string; icon: typeof SunIcon }[] = [
    { value: "light", label: dict.theme.light, icon: SunIcon },
    { value: "dark", label: dict.theme.dark, icon: MoonIcon },
    { value: "system", label: dict.theme.system, icon: MonitorIcon },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="p-5">
        <h3 className="font-semibold text-brand-950 dark:text-white">
          {dict.settingsUI.appearanceTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {dict.settingsUI.appearanceSubtitle}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => applyTheme(opt.value)}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors ${
                pref === opt.value
                  ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-200"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <opt.icon width={18} height={18} />
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-brand-950 dark:text-white">
          {dict.settingsUI.currencyTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {dict.settingsUI.currencySubtitle}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {defaultCurrencies
            .filter((c) => c.enabled)
            .map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code as CurrencyCode)}
                className={`cursor-pointer rounded-lg border p-2.5 text-xs font-semibold transition-colors ${
                  currency === c.code
                    ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-200"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {c.code}
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
}
