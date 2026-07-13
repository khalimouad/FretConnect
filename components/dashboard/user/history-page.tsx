import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { acceptances, offers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { CheckIcon } from "@/components/icons";

export function UserHistoryPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const history = acceptances.map((a) => ({
    ...a,
    offer: offers.find((o) => o.id === a.offerId)!,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">
        {dict.userDash.historyTitle}
      </h1>

      {history.length === 0 ? (
        <Card className="mt-6 p-8 text-center text-sm text-slate-500">
          {dict.userDash.historyEmpty}
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
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
                <p className="mt-1 text-xs text-slate-400">{formatDate(h.createdAt, locale)}</p>
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
    </>
  );
}
