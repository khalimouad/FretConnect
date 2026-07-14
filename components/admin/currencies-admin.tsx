"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { defaultCurrencies, type Currency } from "@/lib/currencies";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { useToast } from "@/components/toast";

export function CurrenciesAdmin({ dict }: { dict: Dictionary }) {
  const { push } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [updatedAt, setUpdatedAt] = useState("2026-07-12");
  const [savedFlash, setSavedFlash] = useState(false);

  function update(code: string, patch: Partial<Currency>) {
    setCurrencies((prev) => prev.map((c) => (c.code === code ? { ...c, ...patch } : c)));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setUpdatedAt(new Date().toISOString().slice(0, 10));
    setSavedFlash(true);
    push(dict.toast.plansSaved);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <form onSubmit={save}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {dict.currencyUI.ratesUpdated}{" "}
          <span className="font-medium text-slate-600 dark:text-slate-300">{updatedAt}</span>
        </p>
        <Button type="submit" size="sm" variant="accent">
          <CheckIcon width={15} height={15} />
          {dict.common.save}
          {savedFlash ? <span className="ms-1">✓</span> : null}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currencies.map((c) => (
          <Card key={c.code} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-brand-950 dark:text-white">
                {c.code} <span className="text-sm text-slate-400 dark:text-slate-500">{c.symbol}</span>
              </p>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={c.enabled}
                  disabled={c.code === "MAD"}
                  onChange={(e) => update(c.code, { enabled: e.target.checked })}
                />
                {dict.adminDash.active}
              </label>
            </div>
            {c.code === "MAD" ? (
              <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
                {dict.currencyUI.label} — 1 MAD = 1 MAD
              </p>
            ) : (
              <Field label={`1 ${c.code} = ? MAD`}>
                <input
                  type="number"
                  min={0}
                  step={0.0001}
                  value={c.rateToMad}
                  onChange={(e) => update(c.code, { rateToMad: Number(e.target.value) })}
                  className={`${inputClass} mt-3`}
                />
              </Field>
            )}
          </Card>
        ))}
      </div>
    </form>
  );
}
