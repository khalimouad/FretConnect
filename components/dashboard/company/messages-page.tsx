"use client";

import type { Dictionary } from "@/lib/i18n";
import { threads, offers, users } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { Button, Card, inputClass } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { MessageIcon } from "@/components/icons";

const COMPANY_ID = "co-atlas";

export function CompanyMessagesPage({ dict }: { dict: Dictionary }) {
  const companyThreads = threads.filter((t) => t.companyId === COMPANY_ID);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">{dict.messages.title}</h1>

      {companyThreads.length === 0 ? (
        <Card className="mt-6 p-8 text-center text-sm text-slate-500">{dict.messages.empty}</Card>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {companyThreads.map((t) => {
            const offer = offers.find((o) => o.id === t.offerId)!;
            const user = users.find((u) => u.id === t.userId);
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
                <p className="mt-1 text-xs text-slate-400">{user?.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-600">
                    {last.from === "company" ? dict.messages.you : user?.name}:
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
      )}
    </>
  );
}
