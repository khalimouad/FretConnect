import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getOffer, searchOffers } from "@/lib/data/repository";
import { cityName, getCity, regions } from "@/lib/data/geo";
import { formatDate, formatMoney } from "@/lib/format";
import { OfferCard, RouteLine } from "@/components/offers/offer-card";
import { ContactPanel } from "@/components/offers/contact-panel";
import { Card, OfferStatusBadge } from "@/components/ui";
import {
  CalendarIcon,
  MapPinIcon,
  ShieldIcon,
  TruckIcon,
  WeightIcon,
} from "@/components/icons";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const offer = await getOffer(id);
  if (!offer) notFound();

  const similar = (
    await searchOffers({ departure: offer.departureCityId })
  )
    .filter((o) => o.id !== offer.id)
    .slice(0, 3);

  const depCity = getCity(offer.departureCityId);
  const arrCity = getCity(offer.arrivalCityId);
  const regionName = (regionId?: string) =>
    regions.find((r) => r.id === regionId)?.name ?? "";

  const facts = [
    {
      icon: CalendarIcon,
      label: dict.offer.availability,
      value:
        formatDate(offer.availableFrom, locale) +
        (offer.availableTo ? ` – ${formatDate(offer.availableTo, locale)}` : ""),
    },
    {
      icon: TruckIcon,
      label: dict.offer.vehicle,
      value: dict.vehicles[offer.vehicleType],
    },
    {
      icon: WeightIcon,
      label: dict.offer.capacity,
      value:
        `${offer.tonnage} ${dict.offer.tons}` +
        (offer.volume ? ` · ${offer.volume} ${dict.offer.volume}` : ""),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href={`/${locale}/search`}
        className="text-sm font-medium text-slate-500 hover:text-brand-800 dark:text-slate-400 dark:hover:text-brand-300"
      >
        <span className="me-1 inline-block rtl:-scale-x-100">←</span>
        {dict.offer.backToSearch}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <RouteLine
                  departure={cityName(offer.departureCityId)}
                  arrival={cityName(offer.arrivalCityId)}
                  className="text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl dark:text-white"
                />
                {offer.publishedAt ? (
                  <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                    {dict.offer.publishedOn} {formatDate(offer.publishedAt, locale)}
                  </p>
                ) : null}
              </div>
              <OfferStatusBadge status={offer.status} dict={dict} />
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <f.icon width={14} height={14} />
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 font-semibold text-brand-950 dark:text-white">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-baseline justify-between rounded-lg bg-accent-50 p-4 ring-1 ring-inset ring-accent-200 dark:bg-accent-950 dark:ring-accent-900">
              <span className="text-sm font-medium text-accent-900 dark:text-accent-300">
                {dict.offer.indicativePrice}
              </span>
              <span className="text-2xl font-bold text-accent-700 dark:text-accent-400">
                {offer.price ? formatMoney(offer.price, locale) : dict.offer.onRequest}
                {offer.price ? (
                  <span className="ms-2 text-sm font-medium text-accent-600 dark:text-accent-400">
                    · {dict.common.negotiable}
                  </span>
                ) : null}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <MapPinIcon width={18} height={18} className="mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {dict.offer.departure}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {depCity?.name}
                    <span className="text-sm text-slate-400 dark:text-slate-500"> · {regionName(depCity?.regionId)}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPinIcon width={18} height={18} className="mt-0.5 text-accent-600 dark:text-accent-400" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {dict.offer.arrival}
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {arrCity?.name}
                    <span className="text-sm text-slate-400 dark:text-slate-500"> · {regionName(arrCity?.regionId)}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {similar.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-brand-950 dark:text-white">{dict.offer.similar}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {similar.map((o) => (
                  <OfferCard key={o.id} offer={o} locale={locale} dict={dict} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Contact sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {dict.offer.carrier}
            </p>
            <p className="mt-1 flex items-center gap-2 text-lg font-bold text-brand-950 dark:text-white">
              {offer.company.name}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
                <ShieldIcon width={11} height={11} />
                {dict.offer.verified}
              </span>
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400 dark:text-slate-500">{dict.common.phone}</dt>
                <dd dir="ltr" className="font-medium text-slate-800 dark:text-slate-200">{offer.company.phone}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400 dark:text-slate-500">{dict.common.email}</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">{offer.company.email}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
              {dict.offer.contactHint}
            </p>
          </Card>

          <Card className="p-6">
            <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {dict.offer.contactTitle}
            </p>
            <ContactPanel dict={dict} />
          </Card>
        </div>
      </div>
    </div>
  );
}
