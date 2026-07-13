import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { companies, offers, plans } from "@/lib/data/mock";
import { formatDate, formatMoney } from "@/lib/format";
import { Card, SubscriptionBadge } from "@/components/ui";

const COMPANY_ID = "co-atlas";

export function CompanySubscriptionPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const company = companies.find((c) => c.id === COMPANY_ID)!;
  const plan = plans.find((p) => p.id === company.planId)!;
  const active = offers.filter((o) => o.companyId === COMPANY_ID && o.status === "active").length;

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">
        {dict.companyDash.subTitle}
      </h1>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-6 p-6">
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
            {active} / {plan.maxActiveOffers ?? dict.plans.fUnlimited}
          </p>
        </div>
        <SubscriptionBadge state={company.subscription.state} dict={dict} />
      </Card>
    </>
  );
}
