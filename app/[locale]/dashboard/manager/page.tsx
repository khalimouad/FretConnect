import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { managers } from "@/lib/data/mock";
import { DashboardShell } from "@/components/dashboard/shell";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";

export default async function ManagerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <DashboardShell
      dict={dict}
      title={dict.managerDash.title}
      subtitle={dict.managerDash.subtitle}
      roleLabel={dict.nav.spaceManager}
      identity={managers[0].name}
    >
      <ManagerDashboard locale={locale} dict={dict} />
    </DashboardShell>
  );
}
