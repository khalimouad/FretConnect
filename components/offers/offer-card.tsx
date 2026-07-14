import Link from "next/link";
import type { OfferWithCompany } from "@/lib/data/repository";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { PriceTag } from "@/components/currency/price-tag";
import {
  CalendarIcon,
  RouteArrowIcon,
  ShieldIcon,
  TruckIcon,
  WeightIcon,
} from "@/components/icons";

export function RouteLine({
  departure,
  arrival,
  className = "",
}: {
  departure: string;
  arrival: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span>{departure}</span>
      <RouteArrowIcon width={18} height={18} className="shrink-0 text-accent-500" />
      <span>{arrival}</span>
    </span>
  );
}

export function OfferCard({
  offer,
  locale,
  dict,
}: {
  offer: OfferWithCompany;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={`/${locale}/offers/${offer.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <RouteLine
          departure={cityName(offer.departureCityId)}
          arrival={cityName(offer.arrivalCityId)}
          className="text-lg font-bold tracking-tight text-brand-950 dark:text-white"
        />
        <p className="text-lg font-bold text-accent-600 dark:text-accent-400">
          {offer.price ? (
            <PriceTag money={offer.price} locale={locale} />
          ) : (
            dict.offer.onRequest
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon width={16} height={16} className="text-slate-400 dark:text-slate-500" />
          {formatDate(offer.availableFrom, locale)}
          {offer.availableTo ? ` – ${formatDate(offer.availableTo, locale)}` : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TruckIcon width={16} height={16} className="text-slate-400 dark:text-slate-500" />
          {dict.vehicles[offer.vehicleType]}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <WeightIcon width={16} height={16} className="text-slate-400 dark:text-slate-500" />
          {offer.tonnage} {dict.offer.tons}
          {offer.volume ? ` · ${offer.volume} ${dict.offer.volume}` : ""}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <ShieldIcon width={15} height={15} className="text-emerald-600 dark:text-emerald-400" />
          {offer.company.name}
        </span>
        <span className="text-sm font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-300">
          {dict.common.viewAll}
          <span className="ms-1 inline-block rtl:-scale-x-100">→</span>
        </span>
      </div>
    </Link>
  );
}
