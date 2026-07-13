import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { managers } from "@/lib/data/mock";
import { BackofficeShell } from "@/components/backoffice/shell";

/** Internal Manager backoffice (§3.2) — carrier validation and follow-up. */
export default async function ManagerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const base = `/${locale}/dashboard/manager`;

  return (
    <BackofficeShell
      tone="dark"
      homeHref={base}
      roleLabel={dict.nav.spaceManager}
      items={[
        { href: base, label: dict.dash.overview, icon: "home" },
        { href: `${base}/companies`, label: dict.dash.companies, icon: "users" },
        { href: `${base}/moderation`, label: dict.dash.moderation, icon: "bell" },
      ]}
      backHref={`/${locale}`}
      backLabel={dict.adminUI.backToSite}
      identityLabel={dict.dash.signedInAs}
      identity={managers[0].name}
      demoNote={`${dict.adminUI.internal} · ${dict.common.demoBanner}`}
    >
      {children}
    </BackofficeShell>
  );
}
