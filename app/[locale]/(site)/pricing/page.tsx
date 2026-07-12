import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { plans } from "@/lib/data/mock";
import { formatMoney } from "@/lib/format";
import { ButtonLink } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const descriptions = {
    basic: dict.plans.basicDesc,
    pro: dict.plans.proDesc,
    enterprise: dict.plans.enterpriseDesc,
  } as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-950">
          {dict.plans.title}
        </h1>
        <p className="mt-3 text-slate-500">{dict.plans.subtitle}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const features = [
            `${plan.maxActiveOffers ?? dict.plans.fUnlimited} ${dict.plans.fActiveOffers}`,
            `${plan.subAccounts ?? dict.plans.fUnlimited} ${dict.plans.fSubAccounts}`,
            dict.plans.fStats,
            dict.plans.fAlertsMatch,
            ...(plan.featured ? [dict.plans.fFeatured] : []),
            ...(plan.prioritySupport ? [dict.plans.fSupport] : []),
          ];
          const highlight = plan.id === "pro";
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-card ${
                highlight ? "border-accent-500 ring-2 ring-accent-500" : "border-slate-200"
              }`}
            >
              {highlight ? (
                <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white rtl:translate-x-1/2">
                  {dict.plans.popular}
                </span>
              ) : null}
              <h2 className="text-lg font-bold text-brand-950">{dict.plans[plan.nameKey]}</h2>
              <p className="mt-1 text-sm text-slate-500">{descriptions[plan.nameKey]}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold tracking-tight text-brand-950">
                  {formatMoney(plan.monthlyPrice, locale)}
                </span>
                <span className="text-sm text-slate-400">{dict.common.perMonth}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={`/${locale}/register?tab=company`}
                variant={highlight ? "accent" : "outline"}
                className="mt-7 w-full"
              >
                {dict.plans.cta}
              </ButtonLink>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">{dict.plans.trialNote}</p>
    </div>
  );
}
