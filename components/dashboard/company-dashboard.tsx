"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Acceptance, Offer, OfferStatus, VehicleType } from "@/lib/domain/types";
import { offerActions } from "@/lib/domain/workflow";
import { acceptances as seedAcceptances, companies, offers as seedOffers, plans, users } from "@/lib/data/mock";
import { cities, cityName } from "@/lib/data/geo";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { Button, Card, OfferStatusBadge, Stat, SubscriptionBadge, inputClass } from "@/components/ui";
import { Section } from "@/components/dashboard/shell";
import { RouteLine } from "@/components/offers/offer-card";
import { CheckIcon, TruckIcon } from "@/components/icons";

const COMPANY_ID = "co-atlas";

const vehicleTypes: VehicleType[] = [
  "truck",
  "van",
  "semi_trailer",
  "refrigerated",
  "flatbed",
  "tanker",
];

export function CompanyDashboard({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const company = companies.find((c) => c.id === COMPANY_ID)!;
  const plan = plans.find((p) => p.id === company.planId)!;

  const [offers, setOffers] = useState<Offer[]>(
    seedOffers.filter((o) => o.companyId === COMPANY_ID),
  );
  const [acceptances, setAcceptances] = useState<Acceptance[]>(
    seedAcceptances.filter((a) =>
      seedOffers.some((o) => o.id === a.offerId && o.companyId === COMPANY_ID),
    ),
  );
  const [showForm, setShowForm] = useState(false);

  const active = offers.filter((o) => o.status === "active");
  const totalViews = offers.reduce((sum, o) => sum + o.views, 0);
  const totalContacts = offers.reduce((sum, o) => sum + o.contacts, 0);
  const pendingAcceptances = acceptances.filter((a) => a.status === "pending");

  function applyAction(offerId: string, to: OfferStatus | "delete") {
    setOffers((prev) =>
      to === "delete"
        ? prev.filter((o) => o.id !== offerId)
        : prev.map((o) => (o.id === offerId ? { ...o, status: to } : o)),
    );
  }

  function resolveAcceptance(id: string, status: "confirmed" | "declined") {
    setAcceptances((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (status === "confirmed") {
      const acc = acceptances.find((a) => a.id === id);
      if (acc) applyAction(acc.offerId, "filled");
    }
  }

  const sortedOffers = useMemo(
    () =>
      [...offers].sort((a, b) => {
        const order: OfferStatus[] = ["active", "draft", "expired", "filled", "suspended", "cancelled", "archived"];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }),
    [offers],
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={dict.companyDash.statActive} value={String(active.length)} tone="accent" />
        <Stat label={dict.companyDash.statViews} value={formatNumber(totalViews, locale)} />
        <Stat label={dict.companyDash.statContacts} value={String(totalContacts)} />
        <Stat
          label={dict.companyDash.statAcceptances}
          value={String(pendingAcceptances.length)}
          tone={pendingAcceptances.length > 0 ? "warn" : "default"}
        />
      </div>

      {/* Acceptance requests: user accepted → carrier confirms (§4.5) */}
      <Section title={dict.companyDash.acceptancesTitle}>
        {pendingAcceptances.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            {dict.companyDash.noAcceptances}
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingAcceptances.map((a) => {
              const offer = offers.find((o) => o.id === a.offerId);
              const user = users.find((u) => u.id === a.userId);
              if (!offer) return null;
              return (
                <Card key={a.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <RouteLine
                        departure={cityName(offer.departureCityId)}
                        arrival={cityName(offer.arrivalCityId)}
                        className="font-semibold text-brand-950"
                      />
                      <p className="mt-1 text-sm text-slate-500">
                        {user?.name} · {formatDate(a.createdAt, locale)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="accent" onClick={() => resolveAcceptance(a.id, "confirmed")}>
                        <CheckIcon width={15} height={15} />
                        {dict.companyDash.confirmMatch}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => resolveAcceptance(a.id, "declined")}>
                        {dict.companyDash.decline}
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                    {dict.companyDash.acceptanceHint}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      {/* Offers with lifecycle actions (§4.2) */}
      <Section
        title={dict.companyDash.offersTitle}
        aside={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <TruckIcon width={15} height={15} />
            {dict.companyDash.createOffer}
          </Button>
        }
      >
        {showForm ? (
          <OfferForm
            dict={dict}
            onCreate={(offer, publish) => {
              setOffers((prev) => [
                { ...offer, status: publish ? "active" : "draft" },
                ...prev,
              ]);
              setShowForm(false);
            }}
          />
        ) : null}

        <Card className="overflow-x-auto">
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
                          onClick={() => applyAction(o.id, action.to)}
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
        <p className="mt-2 text-xs text-slate-400">{dict.companyDash.expiresAuto}</p>
      </Section>

      {/* Subscription (§5) */}
      <Section title={dict.companyDash.subTitle}>
        <Card className="flex flex-wrap items-center justify-between gap-6 p-6">
          <div>
            <p className="text-sm text-slate-400">{dict.companyDash.planLabel}</p>
            <p className="text-xl font-bold text-brand-950">
              {dict.plans[plan.nameKey]}{" "}
              <span className="text-sm font-medium text-slate-400">
                · {formatMoney(plan.monthlyPrice, locale)}
                {dict.common.perMonth}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">{dict.companyDash.renewsOn}</p>
            <p className="font-semibold text-slate-800">
              {formatDate(company.subscription.renewsOn, locale)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">{dict.companyDash.offersQuota}</p>
            <p className="font-semibold text-slate-800">
              {active.length} / {plan.maxActiveOffers ?? dict.plans.fUnlimited}
            </p>
          </div>
          <SubscriptionBadge state={company.subscription.state} dict={dict} />
        </Card>
      </Section>
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
    <Card className="mb-4 p-5">
      <p className="mb-4 font-semibold text-brand-950">{dict.companyDash.formTitle}</p>
      <form
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate(build(), true);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {dict.companyDash.fDeparture}
          </span>
          <select value={dep} onChange={(e) => setDep(e.target.value)} className={inputClass}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {dict.companyDash.fArrival}
          </span>
          <select value={arr} onChange={(e) => setArr(e.target.value)} className={inputClass}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {dict.companyDash.fDateStart}
          </span>
          <input type="date" required value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {dict.companyDash.fDateEnd}
          </span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <span id="price-hint" className="mt-1 block text-xs text-slate-400">
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
