"use client";

import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Company, Offer } from "@/lib/domain/types";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { OfferStatusBadge } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { DataTable, type Column } from "@/components/table/data-table";

export function AdminOverviewTable({
  locale,
  dict,
  offers,
  companies,
}: {
  locale: Locale;
  dict: Dictionary;
  offers: Offer[];
  companies: Company[];
}) {
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  const columns: Column<Offer>[] = [
    {
      key: "route",
      label: dict.offer.route,
      sortable: true,
      value: (o) => `${cityName(o.departureCityId)} ${cityName(o.arrivalCityId)}`,
      render: (o) => (
        <RouteLine
          departure={cityName(o.departureCityId)}
          arrival={cityName(o.arrivalCityId)}
          className="font-medium text-brand-950 dark:text-white"
        />
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
      key: "publishedAt",
      label: dict.offer.publishedOn,
      sortable: true,
      value: (o) => o.publishedAt ?? "",
      render: (o) => (
        <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
          {o.publishedAt ? formatDate(o.publishedAt, locale) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: dict.common.status,
      render: (o) => <OfferStatusBadge status={o.status} dict={dict} />,
    },
    {
      key: "views",
      label: dict.companyDash.statViews,
      sortable: true,
      align: "end",
      value: (o) => o.views,
      render: (o) => <span className="text-slate-500 dark:text-slate-400">{o.views}</span>,
    },
  ];

  return <DataTable columns={columns} rows={offers} dict={dict} exportFilename="offres-admin.csv" />;
}
