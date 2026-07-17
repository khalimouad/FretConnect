"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { OfferWithCompany } from "@/lib/data/repository";
import { OfferCard } from "@/components/offers/offer-card";
import { RouteMap, type MapRoute } from "@/components/map/route-map";
import { Card } from "@/components/ui";
import { ListIcon, MapPinIcon } from "@/components/icons";

export function SearchResultsView({
  results,
  locale,
  dict,
}: {
  results: OfferWithCompany[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [view, setView] = useState<"list" | "map">("list");

  const routes: MapRoute[] = results.map((o) => ({
    id: o.id,
    departureCityId: o.departureCityId,
    arrivalCityId: o.arrivalCityId,
    price: o.price,
    href: `/${locale}/offers/${o.id}`,
  }));

  return (
    <>
      <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            view === "list"
              ? "bg-brand-900 text-white dark:bg-brand-700"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <ListIcon width={14} height={14} />
          {dict.map.listView}
        </button>
        <button
          type="button"
          onClick={() => setView("map")}
          className={`flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            view === "map"
              ? "bg-brand-900 text-white dark:bg-brand-700"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <MapPinIcon width={14} height={14} />
          {dict.map.mapView}
        </button>
      </div>

      {view === "list" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((offer) => (
            <OfferCard key={offer.id} offer={offer} locale={locale} dict={dict} />
          ))}
        </div>
      ) : (
        <Card className="p-3 sm:p-5">
          <RouteMap routes={routes} locale={locale} dict={dict} />
        </Card>
      )}
    </>
  );
}
