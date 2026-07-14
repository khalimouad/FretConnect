"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Company, CompanyStatus } from "@/lib/domain/types";
import { companies as seedCompanies, offers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Button, Card, Stat } from "@/components/ui";
import { CheckIcon, ShieldIcon } from "@/components/icons";

export function ManagerOverview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const flagged = offers.filter((o) => o.flagged && o.status === "active");

  const pending = companies.filter((c) => c.status === "pending");
  const managed = companies.filter((c) => c.status !== "pending" && c.status !== "rejected");
  const expiring = managed.filter(
    (c) => c.subscription.state === "expiring" || c.subscription.state === "overdue",
  );

  function setStatus(id: string, to: CompanyStatus) {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, status: to } : c)));
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">{dict.dash.overview}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.managerDash.subtitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={dict.managerDash.statPending}
          value={String(pending.length)}
          tone={pending.length > 0 ? "warn" : "default"}
        />
        <Stat label={dict.managerDash.statManaged} value={String(managed.length)} />
        <Stat
          label={dict.managerDash.statExpiring}
          value={String(expiring.length)}
          tone={expiring.length > 0 ? "warn" : "default"}
        />
        <Stat label={dict.managerDash.statFlagged} value={String(flagged.length)} tone="accent" />
      </div>

      <h2 className="mt-10 text-lg font-bold text-brand-950 dark:text-white">{dict.managerDash.pendingTitle}</h2>
      <div className="mt-4">
        {pending.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {dict.managerDash.noPending}
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-brand-950 dark:text-white">
                    <ShieldIcon width={16} height={16} className="text-slate-400 dark:text-slate-500" />
                    {c.name}
                    <span className="text-sm font-normal text-slate-400 dark:text-slate-500">
                      · {cityName(c.cityId)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {dict.managerDash.docs}: ICE <span dir="ltr">{c.ice}</span> ·{" "}
                    <span dir="ltr">{c.phone}</span> · {c.email}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(c.registeredAt, locale)} · {dict.auth.fleetSize}: {c.fleetSize}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="accent" onClick={() => setStatus(c.id, "validated")}>
                    <CheckIcon width={15} height={15} />
                    {dict.managerDash.validate}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setStatus(c.id, "rejected")}>
                    {dict.managerDash.reject}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
