import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { companies, offers, plans } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { Card, OfferStatusBadge, Stat } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const activeCarriers = companies.filter((c) => c.status === "validated");
  const published = offers.filter((o) => o.publishedAt);
  const filled = offers.filter((o) => o.status === "filled").length;
  const matchRate = Math.round((filled / published.length) * 100);
  const mrr = activeCarriers.reduce(
    (sum, c) => sum + (plans.find((p) => p.id === c.planId)?.monthlyPrice.amount ?? 0),
    0,
  );
  const latest = [...published]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 8);
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.dash.overview}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.adminDash.subtitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label={dict.adminDash.statUsers} value={formatNumber(1284, locale)} />
        <Stat label={dict.adminDash.statCompanies} value={String(activeCarriers.length)} />
        <Stat label={dict.adminDash.statOffers} value={String(published.length)} />
        <Stat label={dict.adminDash.statMatchRate} value={`${matchRate}%`} tone="accent" />
        <Stat
          label={dict.adminUI.mrr}
          value={formatMoney({ amount: mrr, currency: "MAD" }, locale)}
          tone="accent"
        />
      </div>

      <h2 className="mt-10 text-lg font-bold text-brand-950 dark:text-white">{dict.adminUI.latestOffers}</h2>
      <Card className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-start font-medium">{dict.offer.route}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.offer.carrier}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.offer.publishedOn}</th>
              <th className="px-4 py-3 text-start font-medium">{dict.common.status}</th>
              <th className="px-4 py-3 text-end font-medium">{dict.companyDash.statViews}</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <RouteLine
                    departure={cityName(o.departureCityId)}
                    arrival={cityName(o.arrivalCityId)}
                    className="font-medium text-brand-950"
                  />
                </td>
                <td className="px-4 py-3 text-slate-500">{companyName(o.companyId)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {o.publishedAt ? formatDate(o.publishedAt, locale) : "—"}
                </td>
                <td className="px-4 py-3">
                  <OfferStatusBadge status={o.status} dict={dict} />
                </td>
                <td className="px-4 py-3 text-end text-slate-500">{o.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
