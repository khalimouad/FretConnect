"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { City, Country } from "@/lib/domain/types";
import { cities as seedCities, countries, regions } from "@/lib/data/geo";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { GlobeIcon, MapPinIcon } from "@/components/icons";
import { useToast } from "@/components/toast";
import { DataTable, type Column } from "@/components/table/data-table";

type CountryRow = Country & { id: string; regionCount: number; cityCount: number };

/**
 * Admin §3.1: manage the Country > Region > City referential — including
 * future activation of West-African and European countries.
 */
export function GeoAdmin({ dict }: { dict: Dictionary }) {
  const { push } = useToast();
  const [cities, setCities] = useState<City[]>(seedCities);
  const [showForm, setShowForm] = useState(false);
  const [regionId, setRegionId] = useState(regions[0].id);
  const [cityName, setCityName] = useState("");

  const zoneLabel: Record<string, string> = {
    maghreb: "Maghreb",
    west_africa: "West Africa",
    europe: "Europe",
  };

  const countryRows: CountryRow[] = countries.map((c) => ({
    ...c,
    id: c.code,
    regionCount: regions.filter((r) => r.countryCode === c.code).length,
    cityCount: cities.filter((ci) => ci.countryCode === c.code).length,
  }));

  const countryColumns: Column<CountryRow>[] = [
    {
      key: "code",
      label: "ISO",
      sortable: true,
      value: (c) => c.code,
      render: (c) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{c.code}</span>
      ),
    },
    {
      key: "name",
      label: dict.dash.geo,
      sortable: true,
      value: (c) => c.name,
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-brand-950 dark:text-white">
          <GlobeIcon width={14} height={14} className="text-slate-300 dark:text-slate-600" />
          {c.name}
        </span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      filterOptions: Object.entries(zoneLabel).map(([value, label]) => ({ value, label })),
      filterValue: (c) => c.zone,
      render: (c) => (
        <span className="text-slate-500 dark:text-slate-400">{zoneLabel[c.zone]}</span>
      ),
    },
    {
      key: "currency",
      label: dict.common.currency,
      value: (c) => c.currency,
      render: (c) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{c.currency}</span>
      ),
    },
    {
      key: "status",
      label: dict.common.status,
      filterOptions: [
        { value: "active", label: dict.adminDash.active },
        { value: "planned", label: dict.adminDash.planned },
      ],
      filterValue: (c) => c.status,
      render: (c) =>
        c.status === "active" ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
            {dict.adminDash.active}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            {dict.adminDash.planned}
          </span>
        ),
    },
    {
      key: "counts",
      label: `${dict.adminDash.regionsCount} / ${dict.adminDash.citiesCount}`,
      value: (c) => c.regionCount + c.cityCount,
      render: (c) => (
        <span className="text-slate-500 dark:text-slate-400">
          {c.regionCount || "—"} / {c.cityCount || "—"}
        </span>
      ),
    },
  ];

  function addCity(e: React.FormEvent) {
    e.preventDefault();
    const region = regions.find((r) => r.id === regionId)!;
    setCities((prev) => [
      ...prev,
      {
        id: `${cityName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        regionId,
        countryCode: region.countryCode,
        name: cityName,
      },
    ]);
    setCityName("");
    setShowForm(false);
    push(dict.toast.citySaved);
  }

  return (
    <>
      <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">{dict.adminDash.geoHint}</p>

      {/* Countries */}
      <div className="mt-6">
        <DataTable
          columns={countryColumns}
          rows={countryRows}
          dict={dict}
          pageSize={10}
          exportFilename="pays.csv"
        />
      </div>

      {/* Regions & cities (Morocco, active) */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-brand-950 dark:text-white">
          Maroc — {dict.adminDash.regionsCount} & {dict.adminDash.citiesCount}
        </h2>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          + {dict.adminUI.addCity}
        </Button>
      </div>

      {showForm ? (
        <Card className="mt-4 p-5">
          <form onSubmit={addCity} className="grid items-end gap-4 sm:grid-cols-3">
            <Field label={dict.adminUI.region}>
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className={inputClass}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={dict.adminUI.cityName}>
              <input
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Button type="submit">{dict.common.save}</Button>
          </form>
        </Card>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {regions.map((r) => {
          const regionCities = cities.filter((c) => c.regionId === r.id);
          return (
            <Card key={r.id} className="p-4">
              <p className="text-sm font-semibold text-brand-950 dark:text-white">{r.name}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {regionCities.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <MapPinIcon width={11} height={11} className="text-slate-400 dark:text-slate-500" />
                    {c.name}
                  </span>
                ))}
                {regionCities.length === 0 ? (
                  <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
