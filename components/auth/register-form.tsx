"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { plans } from "@/lib/data/mock";
import { cities } from "@/lib/data/geo";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { CheckIcon, ShieldIcon, TruckIcon } from "@/components/icons";

type Tab = "user" | "company";

/**
 * Two-track sign-up (§4.1): simple end-user registration vs. carrier
 * onboarding (legal info + plan choice, activated after manager validation).
 */
export function RegisterForm({
  locale,
  dict,
  initialTab,
}: {
  locale: Locale;
  dict: Dictionary;
  initialTab: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [submitted, setSubmitted] = useState<Tab | null>(null);
  const [plan, setPlan] = useState("pro");

  if (submitted === "company") {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-900">
          <CheckIcon width={28} height={28} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-brand-950 dark:text-white">
          {dict.auth.applicationSent}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {dict.auth.applicationSentText}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-block rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 dark:bg-brand-700 dark:hover:bg-brand-600"
        >
          {dict.common.back}
        </Link>
      </Card>
    );
  }

  if (submitted === "user") {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-900">
          <CheckIcon width={28} height={28} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-brand-950 dark:text-white">
          {dict.dash.welcome} 👋
        </h2>
        <Link
          href={`/${locale}/dashboard/user`}
          className="mt-6 inline-block rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 dark:bg-brand-700 dark:hover:bg-brand-600"
        >
          {dict.common.dashboard}
        </Link>
      </Card>
    );
  }

  return (
    <>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-900">
        {(
          [
            { key: "user", label: dict.auth.tabUser, icon: ShieldIcon },
            { key: "company", label: dict.auth.tabCompany, icon: TruckIcon },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-white text-brand-950 shadow-card dark:bg-slate-800 dark:text-white dark:shadow-none"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <t.icon width={16} height={16} />
            {t.label}
          </button>
        ))}
      </div>

      <Card className="mt-4 p-6">
        {tab === "user" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted("user");
            }}
          >
            <Field label={dict.auth.fullName}>
              <input type="text" required className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.common.phone}>
                <input type="tel" required dir="ltr" className={inputClass} placeholder="+212 6…" />
              </Field>
              <Field label={dict.common.email}>
                <input type="email" required className={inputClass} />
              </Field>
            </div>
            <Field label={dict.auth.password}>
              <input type="password" required className={inputClass} autoComplete="new-password" />
            </Field>
            <p className="text-xs text-slate-400 dark:text-slate-500">{dict.auth.userNote}</p>
            <Button type="submit" className="w-full" size="lg">
              {dict.auth.createAccount}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted("company");
            }}
          >
            <Field label={dict.auth.companyName}>
              <input type="text" required className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.auth.ice}>
                <input type="text" required dir="ltr" className={inputClass} placeholder="00152369800…" />
              </Field>
              <Field label={dict.auth.companyCity}>
                <select className={inputClass} required defaultValue="">
                  <option value="" disabled />
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.common.phone}>
                <input type="tel" required dir="ltr" className={inputClass} placeholder="+212 5…" />
              </Field>
              <Field label={dict.common.email}>
                <input type="email" required className={inputClass} />
              </Field>
            </div>
            <Field label={dict.auth.fleetSize}>
              <input type="number" min={1} required className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.settingsUI.whatsappNumber} hint="+212 6XX XXX XXX">
                <input type="tel" dir="ltr" className={inputClass} placeholder="+212 6…" />
              </Field>
              <Field label={dict.settingsUI.telegramHandle} hint="@username">
                <input type="text" dir="ltr" className={inputClass} placeholder="@username" />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {dict.auth.choosePlan}
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {plans.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`cursor-pointer rounded-lg border p-3 text-start transition-colors ${
                      plan === p.id
                        ? "border-accent-500 bg-accent-50 ring-1 ring-accent-500 dark:bg-accent-950"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm font-bold text-brand-950 dark:text-white">
                      {dict.plans[p.nameKey]}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {p.monthlyPrice.amount} {dict.common.currency}
                      {dict.common.perMonth}
                    </p>
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900">
              {dict.auth.companyNote}
            </p>
            <Button type="submit" variant="accent" className="w-full" size="lg">
              {dict.auth.submitApplication}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {dict.auth.haveAccount}{" "}
          <Link href={`/${locale}/login`} className="font-semibold text-accent-600 hover:underline dark:text-accent-400">
            {dict.common.login}
          </Link>
        </p>
      </Card>
    </>
  );
}
