"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Alert, VehicleType } from "@/lib/domain/types";
import { alerts as seedAlerts, users } from "@/lib/data/mock";
import { cities, cityName } from "@/lib/data/geo";
import { Button, Card, inputClass } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { BellIcon } from "@/components/icons";

const vehicleTypes: VehicleType[] = [
  "truck",
  "van",
  "semi_trailer",
  "refrigerated",
  "flatbed",
  "tanker",
];

export function UserAlertsPage({ dict }: { dict: Dictionary }) {
  const user = users[0];
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [showForm, setShowForm] = useState(false);
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [veh, setVeh] = useState("");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);

  function addAlert(e: React.FormEvent) {
    e.preventDefault();
    setAlerts((prev) => [
      ...prev,
      {
        id: `al-${Date.now()}`,
        userId: user.id,
        departureCityId: dep || undefined,
        arrivalCityId: arr || undefined,
        vehicleType: (veh || undefined) as VehicleType | undefined,
        channels: { email, push },
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowForm(false);
    setDep("");
    setArr("");
    setVeh("");
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-950">{dict.dash.alerts}</h1>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <BellIcon width={15} height={15} />
          {dict.userDash.newAlert}
        </Button>
      </div>

      {showForm ? (
        <Card className="mt-6 p-5">
          <form onSubmit={addAlert} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {dict.search.departureCity}
              </span>
              <select value={dep} onChange={(e) => setDep(e.target.value)} className={inputClass}>
                <option value="">{dict.search.anyCity}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {dict.search.arrivalCity}
              </span>
              <select value={arr} onChange={(e) => setArr(e.target.value)} className={inputClass}>
                <option value="">{dict.search.anyCity}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {dict.userDash.alertVehicle}
              </span>
              <select value={veh} onChange={(e) => setVeh(e.target.value)} className={inputClass}>
                <option value="">{dict.search.anyVehicle}</option>
                {vehicleTypes.map((v) => (
                  <option key={v} value={v}>{dict.vehicles[v]}</option>
                ))}
              </select>
            </label>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {dict.userDash.notifyBy}
              </span>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-1.5 text-sm text-slate-600">
                  <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
                  {dict.userDash.notifEmail}
                </label>
                <label className="flex items-center gap-1.5 text-sm text-slate-600">
                  <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} />
                  {dict.userDash.notifPush}
                </label>
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit" size="sm">{dict.common.save}</Button>
            </div>
          </form>
        </Card>
      ) : null}

      {alerts.length === 0 ? (
        <Card className="mt-6 p-8 text-center text-sm text-slate-500">{dict.userDash.noAlerts}</Card>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {alerts.map((a) => (
            <Card key={a.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <RouteLine
                  departure={a.departureCityId ? cityName(a.departureCityId) : dict.search.anyCity}
                  arrival={a.arrivalCityId ? cityName(a.arrivalCityId) : dict.search.anyCity}
                  className="font-semibold text-brand-950"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {a.vehicleType ? `${dict.vehicles[a.vehicleType]} · ` : ""}
                  {a.channels.email ? dict.userDash.notifEmail : ""}
                  {a.channels.email && a.channels.push ? " + " : ""}
                  {a.channels.push ? dict.userDash.notifPush : ""}
                </p>
              </div>
              <button
                onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== a.id))}
                className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                {dict.userDash.deleteAlert}
              </button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
