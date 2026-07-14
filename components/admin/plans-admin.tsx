"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Plan } from "@/lib/domain/types";
import { companies, plans as seedPlans } from "@/lib/data/mock";
import { formatMoney } from "@/lib/format";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { useToast } from "@/components/toast";

/** Admin §3.1: manage subscription plans and pricing for carriers. */
export function PlansAdmin({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { push } = useToast();
  const [plans, setPlans] = useState<Plan[]>(seedPlans);
  const [savedId, setSavedId] = useState<string | null>(null);

  function update(id: string, patch: Partial<Plan>) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => {
        const subscribers = companies.filter(
          (c) => c.planId === plan.id && c.status === "validated",
        ).length;
        return (
          <Card key={plan.id} className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-950 dark:text-white">{dict.plans[plan.nameKey]}</h2>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-800">
                {subscribers} {dict.adminDash.companiesCount}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-accent-600 dark:text-accent-400">
              {formatMoney(plan.monthlyPrice, locale)}
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{dict.common.perMonth}</span>
            </p>

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSavedId(plan.id);
                push(dict.toast.plansSaved);
                setTimeout(() => setSavedId(null), 2000);
              }}
            >
              <Field label={dict.adminUI.planPrice}>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={plan.monthlyPrice.amount}
                  onChange={(e) =>
                    update(plan.id, {
                      monthlyPrice: { amount: Number(e.target.value), currency: "MAD" },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label={dict.plans.fActiveOffers} hint={dict.plans.fUnlimited + " = 0"}>
                <input
                  type="number"
                  min={0}
                  value={plan.maxActiveOffers ?? 0}
                  onChange={(e) =>
                    update(plan.id, {
                      maxActiveOffers: Number(e.target.value) || null,
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" variant="outline">
                  {dict.common.save}
                </Button>
                {savedId === plan.id ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckIcon width={13} height={13} />
                    {dict.adminUI.saved}
                  </span>
                ) : null}
              </div>
            </form>
          </Card>
        );
      })}
    </div>
  );
}
