"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Offer } from "@/lib/domain/types";
import { offers as seedOffers } from "@/lib/data/mock";
import { cityName } from "@/lib/data/geo";
import { Button, Card } from "@/components/ui";
import { RouteLine } from "@/components/offers/offer-card";
import { useToast } from "@/components/toast";

export function ManagerModerationPage({ dict }: { dict: Dictionary }) {
  const { push } = useToast();
  const [flagged, setFlagged] = useState<Offer[]>(
    seedOffers.filter((o) => o.flagged && o.status === "active"),
  );

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.managerDash.moderationTitle}
      </h1>

      <div className="mt-6">
        {flagged.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {dict.managerDash.noFlagged}
          </Card>
        ) : (
          <div className="space-y-3">
            {flagged.map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <RouteLine
                    departure={cityName(o.departureCityId)}
                    arrival={cityName(o.arrivalCityId)}
                    className="font-semibold text-brand-950 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-amber-700">
                    {dict.managerDash.flagReason}: {o.flagged?.reason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setFlagged((prev) => prev.filter((x) => x.id !== o.id));
                      push(dict.toast.offerSuspendedMod);
                    }}
                  >
                    {dict.managerDash.suspendOffer}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFlagged((prev) => prev.filter((x) => x.id !== o.id));
                      push(dict.toast.offerDismissed, "info");
                    }}
                  >
                    {dict.managerDash.dismiss}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
