"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Acceptance } from "@/lib/domain/types";
import { acceptances as seedAcceptances, offers, users } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate, formatNumber } from "@/lib/format";
import { Button, Card, Stat } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { CheckIcon } from "@/components/icons";

const COMPANY_ID = "co-atlas";

export function CompanyOverview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const companyOffers = offers.filter((o) => o.companyId === COMPANY_ID);
  const active = companyOffers.filter((o) => o.status === "active");
  const totalViews = companyOffers.reduce((sum, o) => sum + o.views, 0);
  const totalContacts = companyOffers.reduce((sum, o) => sum + o.contacts, 0);

  const [acceptances, setAcceptances] = useState<Acceptance[]>(
    seedAcceptances.filter((a) =>
      companyOffers.some((o) => o.id === a.offerId),
    ),
  );
  const pending = acceptances.filter((a) => a.status === "pending");

  function resolve(id: string, status: "confirmed" | "declined") {
    setAcceptances((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">{dict.dash.overview}</h1>
      <p className="mt-1 text-sm text-slate-500">{dict.companyDash.subtitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={dict.companyDash.statActive} value={String(active.length)} tone="accent" />
        <Stat label={dict.companyDash.statViews} value={formatNumber(totalViews, locale)} />
        <Stat label={dict.companyDash.statContacts} value={String(totalContacts)} />
        <Stat
          label={dict.companyDash.statAcceptances}
          value={String(pending.length)}
          tone={pending.length > 0 ? "warn" : "default"}
        />
      </div>

      <h2 className="mt-10 text-lg font-bold text-brand-950">
        {dict.companyDash.acceptancesTitle}
      </h2>
      <div className="mt-4">
        {pending.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            {dict.companyDash.noAcceptances}
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((a) => {
              const offer = companyOffers.find((o) => o.id === a.offerId);
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
                      <Button size="sm" variant="accent" onClick={() => resolve(a.id, "confirmed")}>
                        <CheckIcon width={15} height={15} />
                        {dict.companyDash.confirmMatch}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => resolve(a.id, "declined")}>
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
      </div>
    </>
  );
}
