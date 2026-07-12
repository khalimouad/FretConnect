import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { companies } from "@/lib/data/mock";
import { DashboardShell } from "@/components/dashboard/shell";
import { CompanyDashboard } from "@/components/dashboard/company-dashboard";

export default async function CompanyDashboardPage({
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
      title={dict.companyDash.title}
      subtitle={dict.companyDash.subtitle}
      roleLabel={dict.nav.spaceCompany}
      identity={companies[0].name}
    >
      <CompanyDashboard locale={locale} dict={dict} />
    </DashboardShell>
  );
}
