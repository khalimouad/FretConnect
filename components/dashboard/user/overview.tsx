import type { Dictionary } from "@/lib/i18n";
import { acceptances, alerts, threads } from "@/lib/data/mock";
import { Stat } from "@/components/ui";

export function UserOverview({ dict }: { dict: Dictionary }) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">{dict.dash.overview}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.userDash.subtitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label={dict.userDash.activeAlerts} value={String(alerts.length)} tone="accent" />
        <Stat label={dict.userDash.acceptedOffers} value={String(acceptances.length)} />
        <Stat label={dict.userDash.conversations} value={String(threads.length)} />
      </div>
    </>
  );
}
