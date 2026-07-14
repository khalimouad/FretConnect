"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Company, CompanyStatus } from "@/lib/domain/types";
import { companies as seedCompanies } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Card, CompanyStatusBadge, SubscriptionBadge } from "@/components/ui";

export function ManagerCompaniesPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [companies, setCompanies] = useState<Company[]>(
    seedCompanies.filter((c) => c.status !== "pending" && c.status !== "rejected"),
  );

  function setStatus(id: string, to: CompanyStatus) {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status: to } : c)));
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.managerDash.companiesTitle}
      </h1>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-start font-medium">{dict.auth.companyName}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.status}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.managerDash.subStatus}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.managerDash.lastPayment}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-brand-950 dark:text-white">{c.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{cityName(c.cityId)}</p>
                </td>
                <td className="px-4 py-3">
                  <CompanyStatusBadge status={c.status} dict={dict} />
                </td>
                <td className="px-4 py-3">
                  <SubscriptionBadge state={c.subscription.state} dict={dict} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {c.subscription.lastPaymentOn
                    ? formatDate(c.subscription.lastPaymentOn, locale)
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {c.status === "validated" ? (
                      <button
                        onClick={() => setStatus(c.id, "suspended")}
                        className="cursor-pointer rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {dict.managerDash.suspend}
                      </button>
                    ) : null}
                    {c.status === "suspended" ? (
                      <button
                        onClick={() => setStatus(c.id, "validated")}
                        className="cursor-pointer rounded-md border border-accent-300 bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700 hover:bg-accent-100 dark:border-accent-800 dark:bg-accent-950 dark:hover:bg-accent-900"
                      >
                        {dict.managerDash.reactivate}
                      </button>
                    ) : null}
                    {c.status !== "closed" ? (
                      <button
                        onClick={() => setStatus(c.id, "closed")}
                        className="cursor-pointer rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        {dict.managerDash.close}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
