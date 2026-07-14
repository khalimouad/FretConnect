import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { companies } from "@/lib/data/mock";
import { BackofficeShell } from "@/components/backoffice/shell";
import { NotificationBell } from "@/components/notifications/bell";
import { companyNotifications } from "@/lib/data/notifications";

/** Carrier back office (§3.3) — restricted to the company's own data. */
export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const base = `/${locale}/dashboard/company`;

  return (
    <BackofficeShell
      tone="dark"
      locale={locale}
      dict={dict}
      homeHref={base}
      roleLabel={dict.nav.spaceCompany}
      items={[
        { href: base, label: dict.dash.overview, icon: "home" },
        { href: `${base}/offers`, label: dict.dash.myOffers, icon: "truck" },
        { href: `${base}/messages`, label: dict.dash.messages, icon: "message" },
        { href: `${base}/notifications`, label: dict.dash.notifications, icon: "inbox" },
        { href: `${base}/subscription`, label: dict.dash.subscription, icon: "card" },
        { href: `${base}/settings`, label: dict.dash.settings, icon: "gear" },
      ]}
      backHref={`/${locale}`}
      backLabel={dict.adminUI.backToSite}
      identityLabel={dict.dash.signedInAs}
      identity={companies[0].name}
      demoNote={dict.common.demoBanner}
      topbarExtra={
        <NotificationBell
          locale={locale}
          dict={dict}
          notifications={companyNotifications}
          homeHref={`${base}/notifications`}
        />
      }
    >
      {children}
    </BackofficeShell>
  );
}
