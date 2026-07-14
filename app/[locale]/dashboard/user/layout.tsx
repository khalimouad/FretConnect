import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { users } from "@/lib/data/mock";
import { BackofficeShell } from "@/components/backoffice/shell";
import { NotificationBell } from "@/components/notifications/bell";
import { userNotifications } from "@/lib/data/notifications";

/** End-user front-office space (§3.4) — light sidebar variant. */
export default async function UserSpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const base = `/${locale}/dashboard/user`;

  return (
    <BackofficeShell
      tone="light"
      locale={locale}
      dict={dict}
      homeHref={base}
      roleLabel={dict.nav.spaceUser}
      items={[
        { href: base, label: dict.dash.overview, icon: "home" },
        { href: `${base}/alerts`, label: dict.dash.alerts, icon: "bell" },
        { href: `${base}/history`, label: dict.dash.history, icon: "list" },
        { href: `${base}/messages`, label: dict.dash.messages, icon: "message" },
        { href: `${base}/notifications`, label: dict.dash.notifications, icon: "inbox" },
        { href: `${base}/settings`, label: dict.dash.settings, icon: "gear" },
      ]}
      backHref={`/${locale}/search`}
      backLabel={dict.nav.findFreight}
      identityLabel={dict.dash.signedInAs}
      identity={users[0].name}
      demoNote={dict.common.demoBanner}
      topbarExtra={
        <NotificationBell
          locale={locale}
          dict={dict}
          notifications={userNotifications}
          homeHref={`${base}/notifications`}
        />
      }
    >
      {children}
    </BackofficeShell>
  );
}
