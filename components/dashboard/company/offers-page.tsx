"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Offer, OfferStatus, VehicleType } from "@/lib/domain/types";
import { offerActions } from "@/lib/domain/workflow";
import { cities, cityName } from "@/lib/data/geo";
import { offers as seedOffers } from "@/lib/data/mock";
import { formatDate, formatMoney } from "@/lib/format";
import { Button, Card, OfferStatusBadge, inputClass } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { TruckIcon } from "@/components/icons";
import { useToast } from "@/components/toast";

const COMPANY_ID = "co-atlas";

const actionToastKey: Record<string, keyof Dictionary["toast"]> = {
  publish: "offerPublished",
  markFilled: "offerFilled",
  cancelOffer: "offerCancelled",
  archive: "offerArchived",
  republish: "offerRepublished",
  delete: "offerDeleted",
};

const vehicleTypes: VehicleType[] = [
  "truck",
  "van",
  "semi_trailer",
  "refrigerated",
  "flatbed",
  "tanker",
];

export function CompanyOffersPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { push } = useToast();
  const [offers, setOffers] = useState<Offer[]>(
    seedOffers.filter((o) => o.companyId === COMPANY_ID),
  );
  const [showForm, setShowForm] = useState(false);

  function applyAction(offerId: string, to: OfferStatus | "delete", labelKey: string) {
    setOffers((prev) =>
      to === "delete"
        ? prev.filter((o) => o.id !== offerId)
        : prev.map((o) => (o.id === offerId ? { ...o, status: to } : o)),
    );
    const key = actionToastKey[labelKey];
    if (key) push(dict.toast[key]);
  }

  const sortedOffers = useMemo(
    () =>
      [...offers].sort((a, b) => {
        const order: OfferStatus[] = [
          "active",
          "draft",
          "expired",
          "filled",
          "suspended",
          "cancelled",
          "archived",
        ];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }),
    [offers],
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
            {dict.companyDash.offersTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.companyDash.expiresAuto}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <TruckIcon width={15} height={15} />
          {dict.companyDash.createOffer}
        </Button>
      </div>

      {showForm ? (
        <OfferForm
          dict={dict}
          onCreate={(offer, publish) => {
            setOffers((prev) => [{ ...offer, status: publish ? "active" : "draft" }, ...prev]);
            setShowForm(false);
            push(publish ? dict.toast.offerPublished : dict.companyDash.offerCreated);
          }}
        />
      ) : null}

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-start text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-start font-medium">{dict.offer.route}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.date}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.offer.vehicle}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.price}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.status}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {sortedOffers.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <RouteLine
                    departure={cityName(o.departureCityId)}
                    arrival={cityName(o.arrivalCityId)}
                    className="font-medium text-brand-950"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {formatDate(o.availableFrom, locale)}
                </td>
                <td className="px-4 py-3 text-slate-500">{dict.vehicles[o.vehicleType]}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {o.price ? formatMoney(o.price, locale) : dict.offer.onRequest}
                </td>
                <td className="px-4 py-3">
                  <OfferStatusBadge status={o.status} dict={dict} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {offerActions(o.status).map((action) => (
                      <button
                        key={action.labelKey}
                        onClick={() => applyAction(o.id, action.to, action.labelKey)}
                        className={`cursor-pointer rounded-md border px-2 py-1 text-xs font-medium ${
                          action.labelKey === "delete"
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : action.labelKey === "publish" || action.labelKey === "republish"
                              ? "border-accent-300 bg-accent-50 text-accent-700 hover:bg-accent-100"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {dict.companyDash[action.labelKey]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function OfferForm({
  dict,
  onCreate,
}: {
  dict: Dictionary;
  onCreate: (offer: Offer, publish: boolean) => void;
}) {
  const [dep, setDep] = useState(cities[0].id);
  const [arr, setArr] = useState(cities[1].id);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState<VehicleType>("truck");
  const [tonnage, setTonnage] = useState("10");
  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("");

  function build(): Offer {
    return {
      id: `of-${Date.now()}`,
      companyId: COMPANY_ID,
      departureCityId: dep,
      arrivalCityId: arr,
      availableFrom: from,
      availableTo: to || undefined,
      vehicleType: vehicle,
      tonnage: Number(tonnage),
      volume: volume ? Number(volume) : undefined,
      price: price ? { amount: Number(price), currency: "MAD" } : undefined,
      status: "draft",
      views: 0,
      contacts: 0,
    };
  }

  return (
    <Card className="mt-6 p-5">
      <p className="mb-4 font-semibold text-brand-950 dark:text-white">{dict.companyDash.formTitle}</p>
      <form
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate(build(), true);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fDeparture}
          </span>
          <select value={dep} onChange={(e) => setDep(e.target.value)} className={inputClass}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fArrival}
          </span>
          <select value={arr} onChange={(e) => setArr(e.target.value)} className={inputClass}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fDateStart}
          </span>
          <input type="date" required value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fDateEnd}
          </span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fVehicle}
          </span>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value as VehicleType)}
            className={inputClass}
          >
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>{dict.vehicles[v]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fTonnage}
          </span>
          <input
            type="number"
            min={0.5}
            step="0.5"
            required
            value={tonnage}
            onChange={(e) => setTonnage(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fVolume}
          </span>
          <input
            type="number"
            min={0}
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {dict.companyDash.fPrice}
          </span>
          <input
            type="number"
            min={0}
            step="50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            aria-describedby="price-hint"
          />
          <span id="price-hint" className="mt-1 block text-xs text-slate-400 dark:text-slate-500">
            {dict.companyDash.fPriceHint}
          </span>
        </label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
          <Button type="submit" variant="accent">
            {dict.companyDash.publishNow}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (from) onCreate(build(), false);
            }}
          >
            {dict.companyDash.saveDraft}
          </Button>
        </div>
      </form>
    </Card>
  );
}
