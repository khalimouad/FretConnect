import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { companies, offers, plans } from "@/lib/data/mock";
import { formatMoney, formatNumber } from "@/lib/format";
import { Stat } from "@/components/ui";
import { AdminOverviewTable } from "@/components/admin/overview-table";

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
  const latest = [...published].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

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
      <div className="mt-4">
        <AdminOverviewTable locale={locale} dict={dict} offers={latest} companies={companies} />
      </div>
    </>
  );
}
