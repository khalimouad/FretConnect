"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Company, CompanyStatus } from "@/lib/domain/types";
import { companies as seedCompanies } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { CompanyStatusBadge, SubscriptionBadge } from "@/components/ui";
import { useToast } from "@/components/toast";
import { DataTable, type Column } from "@/components/table/data-table";

const statusToast: Record<CompanyStatus, keyof Dictionary["toast"] | null> = {
  pending: null,
  validated: "companyReactivated",
  suspended: "companySuspended",
  rejected: null,
  closed: "companyClosed",
};

const companyStatuses: CompanyStatus[] = ["validated", "suspended", "closed"];

export function ManagerCompaniesPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { push } = useToast();
  const [companies, setCompanies] = useState<Company[]>(
    seedCompanies.filter((c) => c.status !== "pending" && c.status !== "rejected"),
  );

  function setStatus(id: string, to: CompanyStatus) {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status: to } : c)));
    const key = statusToast[to];
    if (key) push(dict.toast[key]);
  }

  const columns: Column<Company>[] = [
    {
      key: "name",
      label: dict.auth.companyName,
      sortable: true,
      value: (c) => c.name,
      render: (c) => (
        <>
          <p className="font-medium text-brand-950 dark:text-white">{c.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{cityName(c.cityId)}</p>
        </>
      ),
    },
    {
      key: "status",
      label: dict.common.status,
      filterOptions: companyStatuses.map((s) => ({ value: s, label: dict.status[s] })),
      filterValue: (c) => c.status,
      render: (c) => <CompanyStatusBadge status={c.status} dict={dict} />,
    },
    {
      key: "subStatus",
      label: dict.managerDash.subStatus,
      render: (c) => <SubscriptionBadge state={c.subscription.state} dict={dict} />,
    },
    {
      key: "lastPayment",
      label: dict.managerDash.lastPayment,
      sortable: true,
      value: (c) => c.subscription.lastPaymentOn ?? "",
      render: (c) => (
        <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
          {c.subscription.lastPaymentOn ? formatDate(c.subscription.lastPaymentOn, locale) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: dict.common.actions,
      render: (c) => (
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
      ),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.managerDash.companiesTitle}
      </h1>

      <div className="mt-6">
        <DataTable columns={columns} rows={companies} dict={dict} exportFilename="societes.csv" />
      </div>
    </>
  );
}
