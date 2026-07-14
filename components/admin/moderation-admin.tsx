"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Offer, OfferStatus } from "@/lib/domain/types";
import { companies, offers as seedOffers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Button, OfferStatusBadge } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { useToast } from "@/components/toast";
import { DataTable, type Column } from "@/components/table/data-table";

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
  const { push } = useToast();
  const [offers, setOffers] = useState<Offer[]>(
    seedOffers.filter((o) => o.status !== "draft"),
  );
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  function setStatus(id: string, status: OfferStatus) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    push(status === "suspended" ? dict.toast.moderationSuspended : dict.toast.moderationReinstated);
  }

  const columns: Column<Offer>[] = [
    {
      key: "route",
      label: dict.offer.route,
      sortable: true,
      value: (o) => `${cityName(o.departureCityId)} ${cityName(o.arrivalCityId)}`,
      render: (o) => (
        <>
          <RouteLine
            departure={cityName(o.departureCityId)}
            arrival={cityName(o.arrivalCityId)}
            className="font-medium text-brand-950 dark:text-white"
          />
          {o.flagged ? (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              ⚠ {dict.managerDash.flagReason}: {o.flagged.reason}
            </p>
          ) : null}
        </>
      ),
    },
    {
      key: "carrier",
      label: dict.offer.carrier,
      filterOptions: companies.map((c) => ({ value: c.id, label: c.name })),
      filterValue: (o) => o.companyId,
      value: (o) => companyName(o.companyId),
      render: (o) => (
        <span className="text-slate-500 dark:text-slate-400">{companyName(o.companyId)}</span>
      ),
    },
    {
      key: "date",
      label: dict.common.date,
      sortable: true,
      value: (o) => o.availableFrom,
      render: (o) => (
        <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
          {formatDate(o.availableFrom, locale)}
        </span>
      ),
    },
    {
      key: "status",
      label: dict.common.status,
      filterOptions: filterableStatuses.map((s) => ({ value: s, label: dict.status[s] })),
      filterValue: (o) => o.status,
      render: (o) => <OfferStatusBadge status={o.status} dict={dict} />,
    },
    {
      key: "actions",
      label: dict.common.actions,
      render: (o) => (
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
            onClick={() => {
              setOffers((prev) => prev.filter((x) => x.id !== o.id));
              push(dict.toast.moderationDeleted, "info");
            }}
          >
            {dict.adminUI.deleteOffer}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={offers} dict={dict} exportFilename="moderation.csv" />
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">{dict.adminDash.moderationNote}</p>
    </>
  );
}
