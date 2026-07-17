import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { searchOffers, type SearchFilters } from "@/lib/data/repository";
import { cities } from "@/lib/data/geo";
import type { CargoType, VehicleType } from "@/lib/domain/types";
import { AlertButton } from "@/components/offers/alert-button";
import { SearchResultsView } from "@/components/search/results-view";
import { FiltersToggle } from "@/components/search/filters-toggle";
import { Button, inputClass } from "@/components/ui";
import { SearchIcon } from "@/components/icons";
import Link from "next/link";

const vehicleTypes: VehicleType[] = [
  "truck",
  "van",
  "semi_trailer",
  "refrigerated",
  "flatbed",
  "tanker",
];

const cargoTypes: CargoType[] = [
  "general",
  "fragile",
  "perishable",
  "construction",
  "vehicles",
  "livestock",
  "hazardous",
  "furniture",
];

type Search = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" && v !== "" ? v : undefined;
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;

  const filters: SearchFilters = {
    departure: str(sp.departure),
    arrival: str(sp.arrival),
    dateFrom: str(sp.date),
    vehicle: str(sp.vehicle) as VehicleType | undefined,
    cargo: str(sp.cargo) as CargoType | undefined,
    minTonnage: str(sp.tonnage) ? Number(str(sp.tonnage)) : undefined,
    maxPrice: str(sp.price) ? Number(str(sp.price)) : undefined,
    sort: (str(sp.sort) as SearchFilters["sort"]) ?? "date",
  };
  const results = await searchOffers(filters);
  const hasRouteFilter = Boolean(filters.departure || filters.arrival);
  const activeCount = [
    filters.departure,
    filters.arrival,
    filters.dateFrom,
    filters.vehicle,
    filters.cargo,
    filters.minTonnage,
    filters.maxPrice,
  ].filter((v) => v !== undefined).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.search.title}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{dict.search.subtitle}</p>

      {/* Filters */}
      <form method="GET" className="mt-8">
      <FiltersToggle label={dict.search.filters} activeCount={activeCount}>
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.departureCity}
          </span>
          <select name="departure" defaultValue={filters.departure ?? ""} className={inputClass}>
            <option value="">{dict.search.anyCity}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.arrivalCity}
          </span>
          <select name="arrival" defaultValue={filters.arrival ?? ""} className={inputClass}>
            <option value="">{dict.search.anyCity}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.dateFrom}
          </span>
          <input type="date" name="date" defaultValue={str(sp.date) ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.vehicleType}
          </span>
          <select name="vehicle" defaultValue={filters.vehicle ?? ""} className={inputClass}>
            <option value="">{dict.search.anyVehicle}</option>
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>
                {dict.vehicles[v]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.cargoType}
          </span>
          <select name="cargo" defaultValue={filters.cargo ?? ""} className={inputClass}>
            <option value="">{dict.search.anyCargo}</option>
            {cargoTypes.map((c) => (
              <option key={c} value={c}>
                {dict.cargo[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.minCapacity}
          </span>
          <input
            type="number"
            name="tonnage"
            min={0}
            step="0.5"
            defaultValue={str(sp.tonnage) ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.maxPrice}
          </span>
          <input
            type="number"
            name="price"
            min={0}
            step="100"
            defaultValue={str(sp.price) ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.search.sortBy}
          </span>
          <select name="sort" defaultValue={filters.sort} className={inputClass}>
            <option value="date">{dict.search.sortDate}</option>
            <option value="price">{dict.search.sortPriceAsc}</option>
            <option value="capacity">{dict.search.sortCapacity}</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            <SearchIcon width={16} height={16} />
            {dict.common.search}
          </Button>
          <Link
            href={`/${locale}/search`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dict.search.clearFilters}
          </Link>
        </div>
      </div>
      </FiltersToggle>
      </form>

      {/* Results */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-brand-950 dark:text-white">{results.length}</span>{" "}
          {dict.search.resultsCount}
        </p>
        {hasRouteFilter ? (
          <AlertButton label={dict.search.createAlert} confirmation={dict.search.alertCreated} />
        ) : null}
      </div>

      {results.length > 0 ? (
        <div className="mt-5">
          <SearchResultsView results={results} locale={locale} dict={dict} />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{dict.search.noResults}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {dict.search.noResultsHint}
          </p>
          <div className="mt-6">
            <AlertButton
              label={dict.search.createAlert}
              confirmation={dict.search.alertCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
