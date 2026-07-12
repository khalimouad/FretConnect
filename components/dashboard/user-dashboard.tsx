"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Alert, VehicleType } from "@/lib/domain/types";
import { acceptances, alerts as seedAlerts, threads, users } from "@/lib/data/mock";
import { offers } from "@/lib/data/mock";
import { cities, cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Button, Card, Stat, inputClass } from "@/components/ui";
import { Section } from "@/components/dashboard/shell";
import { RouteLine } from "@/components/offers/offer-card";
import { BellIcon, CheckIcon, MessageIcon } from "@/components/icons";

const vehicleTypes: VehicleType[] = [
  "truck",
  "van",
  "semi_trailer",
  "refrigerated",
  "flatbed",
  "tanker",
];

export function UserDashboard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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

  const history = acceptances.map((a) => ({
    ...a,
    offer: offers.find((o) => o.id === a.offerId)!,
  }));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={dict.userDash.activeAlerts} value={String(alerts.length)} tone="accent" />
        <Stat label={dict.userDash.acceptedOffers} value={String(history.length)} />
        <Stat label={dict.userDash.conversations} value={String(threads.length)} />
      </div>

      {/* Alerts (§4.4) */}
      <Section
        title={dict.dash.alerts}
        aside={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <BellIcon width={15} height={15} />
            {dict.userDash.newAlert}
          </Button>
        }
      >
        {showForm ? (
          <Card className="mb-4 p-5">
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
          <Card className="p-8 text-center text-sm text-slate-500">{dict.userDash.noAlerts}</Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
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
      </Section>

      {/* History (§4.6) */}
      <Section title={dict.userDash.historyTitle}>
        {history.length === 0 ? (
          <Card className="p-8 text-center text-sm text-slate-500">
            {dict.userDash.historyEmpty}
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <Card key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link href={`/${locale}/offers/${h.offer.id}`} className="hover:underline">
                    <RouteLine
                      departure={cityName(h.offer.departureCityId)}
                      arrival={cityName(h.offer.arrivalCityId)}
                      className="font-semibold text-brand-950"
                    />
                  </Link>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(h.createdAt, locale)}
                  </p>
                </div>
                {h.status === "confirmed" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <CheckIcon width={13} height={13} />
                    {dict.userDash.confirmed}
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                    {dict.userDash.awaitingConfirm}
                  </span>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Messages (§4.5) */}
      <Section title={dict.messages.title}>
        <div className="grid gap-3 md:grid-cols-2">
          {threads.map((t) => {
            const offer = offers.find((o) => o.id === t.offerId)!;
            const last = t.messages[t.messages.length - 1];
            return (
              <Card key={t.id} className="p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                  <MessageIcon width={16} height={16} className="text-brand-600" />
                  <RouteLine
                    departure={cityName(offer.departureCityId)}
                    arrival={cityName(offer.arrivalCityId)}
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-600">
                    {last.from === "user" ? dict.messages.you : dict.offer.carrier}:
                  </span>{" "}
                  {last.body}
                </p>
                <div className="mt-3 flex gap-2">
                  <input className={inputClass} placeholder={dict.messages.reply} />
                  <Button size="sm" variant="outline">{dict.common.send}</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
