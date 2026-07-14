import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { BackofficeShell } from "@/components/backoffice/shell";
import { NotificationBell } from "@/components/notifications/bell";
import { adminNotifications } from "@/lib/data/notifications";

/** Internal Administrator backoffice (§3.1). Auth-gated in production. */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const base = `/${locale}/admin`;

  return (
    <BackofficeShell
      tone="dark"
      locale={locale}
      dict={dict}
      homeHref={base}
      roleLabel={dict.adminDash.title}
      items={[
        { href: base, label: dict.dash.overview, icon: "home" },
        { href: `${base}/managers`, label: dict.dash.managers, icon: "shield" },
        { href: `${base}/moderation`, label: dict.dash.moderation, icon: "bell" },
        { href: `${base}/geo`, label: dict.dash.geo, icon: "mappin" },
        { href: `${base}/plans`, label: dict.dash.plansAdmin, icon: "globe" },
        { href: `${base}/currencies`, label: dict.dash.currencies, icon: "card" },
      ]}
      backHref={`/${locale}`}
      backLabel={dict.adminUI.backToSite}
      identityLabel={dict.dash.signedInAs}
      identity="admin@fretconnect.ma"
      demoNote={`${dict.adminUI.internal} · ${dict.common.demoBanner}`}
      topbarExtra={
        <NotificationBell locale={locale} dict={dict} notifications={adminNotifications} />
      }
    >
      {children}
    </BackofficeShell>
  );
}
