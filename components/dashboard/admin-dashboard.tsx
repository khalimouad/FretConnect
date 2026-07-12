"use client";

import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { companies, managers, offers, plans } from "@/lib/data/mock";
import { cities, countries, regions } from "@/lib/data/geo";
import { formatMoney } from "@/lib/format";
import { Card, Stat } from "@/components/ui";
import { Section } from "@/components/dashboard/shell";
import { GlobeIcon, ShieldIcon } from "@/components/icons";

export function AdminDashboard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const activeCarriers = companies.filter((c) => c.status === "validated").length;
  const published = offers.filter((o) => o.publishedAt).length;
  const filled = offers.filter((o) => o.status === "filled").length;
  const matchRate = Math.round((filled / published) * 100);

  const zoneLabel: Record<string, string> = {
    maghreb: "Maghreb",
    west_africa: "West Africa",
    europe: "Europe",
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={dict.adminDash.statUsers} value="1 284" />
        <Stat label={dict.adminDash.statCompanies} value={String(activeCarriers)} />
        <Stat label={dict.adminDash.statOffers} value={String(published)} />
        <Stat label={dict.adminDash.statMatchRate} value={`${matchRate}%`} tone="accent" />
      </div>

      {/* Managers (§3.1) */}
      <Section
        title={dict.adminDash.managersTitle}
        aside={
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            + {dict.adminDash.addManager}
          </span>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {managers.map((m) => {
            const portfolio = companies.filter((c) => c.managerId === m.id).length;
            return (
              <Card key={m.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-brand-950">
                    <ShieldIcon width={16} height={16} className="text-brand-500" />
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">{m.email}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm text-slate-400">{dict.adminDash.portfolio}</p>
                  <p className="font-bold text-brand-950">
                    {portfolio}{" "}
                    <span className="text-sm font-normal text-slate-400">
                      {dict.adminDash.companiesCount}
                    </span>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Geographic referential — Country > Region > City (§2, §6.2) */}
      <Section title={dict.adminDash.geoTitle}>
        <p className="mb-4 max-w-2xl text-sm text-slate-500">{dict.adminDash.geoHint}</p>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-start font-medium">ISO</th>
                <th className="px-4 py-3 text-start font-medium">{dict.adminDash.geoTitle}</th>
                <th className="px-4 py-3 text-start font-medium">Zone</th>
                <th className="px-4 py-3 text-start font-medium">{dict.common.currency}</th>
                <th className="px-4 py-3 text-start font-medium">{dict.common.status}</th>
                <th className="px-4 py-3 text-start font-medium">
                  {dict.adminDash.regionsCount} / {dict.adminDash.citiesCount}
                </th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => {
                const regionCount = regions.filter((r) => r.countryCode === c.code).length;
                const cityCount = cities.filter((ci) => ci.countryCode === c.code).length;
                return (
                  <tr key={c.code} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.code}</td>
                    <td className="px-4 py-3 font-medium text-brand-950">
                      <span className="inline-flex items-center gap-1.5">
                        <GlobeIcon width={14} height={14} className="text-slate-300" />
                        {c.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{zoneLabel[c.zone]}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.currency}</td>
                    <td className="px-4 py-3">
                      {c.status === "active" ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          {dict.adminDash.active}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                          {dict.adminDash.planned}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {regionCount || "—"} / {cityCount || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Plans (§5) */}
      <Section title={dict.adminDash.plansTitle}>
        <div className="grid gap-3 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-950">{dict.plans[p.nameKey]}</p>
                <span className="text-xs font-medium text-slate-400">
                  {dict.adminDash.editPricing}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-accent-600">
                {formatMoney(p.monthlyPrice, locale)}
                <span className="text-sm font-medium text-slate-400">{dict.common.perMonth}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {p.maxActiveOffers ?? dict.plans.fUnlimited} {dict.plans.fActiveOffers} ·{" "}
                {p.subAccounts ?? dict.plans.fUnlimited} {dict.plans.fSubAccounts}
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-slate-100 p-3 text-xs text-slate-500">
          {dict.adminDash.moderationNote}
        </p>
      </Section>
    </>
  );
}
