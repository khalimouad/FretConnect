import type { Dictionary } from "@/lib/i18n";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PreferencesSection } from "@/components/settings/preferences";

export function CompanySettingsPage({ dict }: { dict: Dictionary }) {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.settingsUI.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.settingsUI.subtitle}</p>

      <div className="mt-6">
        <PreferencesSection dict={dict} />
      </div>

      <h2 className="mt-10 text-lg font-bold text-brand-950 dark:text-white">
        {dict.settingsUI.notifTitle}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {dict.settingsUI.notifSubtitle}
      </p>
      <div className="mt-4">
        <NotificationSettings
          dict={dict}
          events={["acceptanceReceived", "subscriptionExpiring"]}
          initialWhatsapp="+212 522 45 67 89"
        />
      </div>
    </>
  );
}
