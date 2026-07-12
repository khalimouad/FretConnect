"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Company, CompanyStatus, Offer } from "@/lib/domain/types";
import { canTransitionCompany } from "@/lib/domain/workflow";
import { companies as seedCompanies, offers as seedOffers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Button, Card, CompanyStatusBadge, Stat, SubscriptionBadge } from "@/components/ui";
import { Section } from "@/components/dashboard/shell";
import { RouteLine } from "@/components/offers/offer-card";
import { CheckIcon, ShieldIcon } from "@/components/icons";

export function ManagerDashboard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const [flagged, setFlagged] = useState<Offer[]>(
    seedOffers.filter((o) => o.flagged && o.status === "active"),
  );

  const pending = companies.filter((c) => c.status === "pending");
  const managed = companies.filter((c) => c.status !== "pending" && c.status !== "rejected");
  const expiring = managed.filter(
    (c) => c.subscription.state === "expiring" || c.subscription.state === "overdue",
  );

  function setStatus(id: string, to: CompanyStatus) {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id && canTransitionCompany(c.status, to) ? { ...c, status: to } : c,
      ),
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Carrier validation (§3.2) */}
      <Section title={dict.managerDash.pendingTitle}>
        {pending.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            {dict.managerDash.noPending}
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-brand-950">
                    <ShieldIcon width={16} height={16} className="text-slate-400" />
                    {c.name}
                    <span className="text-sm font-normal text-slate-400">
                      · {cityName(c.cityId)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {dict.managerDash.docs}: ICE <span dir="ltr">{c.ice}</span> ·{" "}
                    <span dir="ltr">{c.phone}</span> · {c.email}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
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
      </Section>

      {/* Managed companies + subscription follow-up */}
      <Section title={dict.managerDash.companiesTitle}>
        <Card className="overflow-x-auto">
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
              {managed.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-950">{c.name}</p>
                    <p className="text-xs text-slate-400">{cityName(c.cityId)}</p>
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
                          className="cursor-pointer rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {dict.managerDash.suspend}
                        </button>
                      ) : null}
                      {c.status === "suspended" ? (
                        <button
                          onClick={() => setStatus(c.id, "validated")}
                          className="cursor-pointer rounded-md border border-accent-300 bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700 hover:bg-accent-100"
                        >
                          {dict.managerDash.reactivate}
                        </button>
                      ) : null}
                      {c.status !== "closed" ? (
                        <button
                          onClick={() => setStatus(c.id, "closed")}
                          className="cursor-pointer rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
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
      </Section>

      {/* Offer moderation */}
      <Section title={dict.managerDash.moderationTitle}>
        {flagged.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            {dict.managerDash.noFlagged}
          </Card>
        ) : (
          <div className="space-y-3">
            {flagged.map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <RouteLine
                    departure={cityName(o.departureCityId)}
                    arrival={cityName(o.arrivalCityId)}
                    className="font-semibold text-brand-950"
                  />
                  <p className="mt-1 text-sm text-amber-700">
                    {dict.managerDash.flagReason}: {o.flagged?.reason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setFlagged((prev) => prev.filter((x) => x.id !== o.id))}
                  >
                    {dict.managerDash.suspendOffer}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFlagged((prev) => prev.filter((x) => x.id !== o.id))}
                  >
                    {dict.managerDash.dismiss}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
