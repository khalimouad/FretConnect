"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Offer, OfferStatus } from "@/lib/domain/types";
import { companies, offers as seedOffers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Button, Card, OfferStatusBadge, inputClass } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";

const filterableStatuses: OfferStatus[] = [
  "active",
  "suspended",
  "filled",
  "expired",
  "archived",
];

/**
 * Admin §3.1: supervision of ALL published offers across carriers, with
 * last-resort moderation (suspend / reinstate / delete).
 */
export function ModerationAdmin({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [offers, setOffers] = useState<Offer[]>(
    seedOffers.filter((o) => o.status !== "draft"),
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");

  const visible = offers.filter(
    (o) =>
      (!statusFilter || o.status === statusFilter) &&
      (!companyFilter || o.companyId === companyFilter),
  );
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  function setStatus(id: string, status: OfferStatus) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">
            {dict.common.status}: {dict.adminUI.filterAll}
          </option>
          {filterableStatuses.map((s) => (
            <option key={s} value={s}>
              {dict.status[s]}
            </option>
          ))}
        </select>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">
            {dict.offer.carrier}: {dict.adminUI.filterAll}
          </option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-start font-medium">{dict.offer.route}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.offer.carrier}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.date}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.status}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr
                key={o.id}
                className={`border-b border-slate-100 last:border-0 ${
                  o.flagged ? "bg-amber-50/60" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <RouteLine
                    departure={cityName(o.departureCityId)}
                    arrival={cityName(o.arrivalCityId)}
                    className="font-medium text-brand-950"
                  />
                  {o.flagged ? (
                    <p className="mt-1 text-xs text-amber-700">
                      ⚠ {dict.managerDash.flagReason}: {o.flagged.reason}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-slate-500">{companyName(o.companyId)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {formatDate(o.availableFrom, locale)}
                </td>
                <td className="px-4 py-3">
                  <OfferStatusBadge status={o.status} dict={dict} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {o.status === "active" ? (
                      <Button size="sm" variant="outline" onClick={() => setStatus(o.id, "suspended")}>
                        {dict.managerDash.suspendOffer}
                      </Button>
                    ) : null}
                    {o.status === "suspended" ? (
                      <Button size="sm" variant="accent" onClick={() => setStatus(o.id, "active")}>
                        {dict.managerDash.reactivate}
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setOffers((prev) => prev.filter((x) => x.id !== o.id))}
                    >
                      {dict.adminUI.deleteOffer}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-3 text-xs text-slate-400">{dict.adminDash.moderationNote}</p>
    </>
  );
}
