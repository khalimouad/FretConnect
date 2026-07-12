import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { DashboardShell } from "@/components/dashboard/shell";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function AdminDashboardPage({
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
      title={dict.adminDash.title}
      subtitle={dict.adminDash.subtitle}
      roleLabel={dict.nav.spaceAdmin}
      identity="admin@fretconnect.ma"
    >
      <AdminDashboard locale={locale} dict={dict} />
    </DashboardShell>
  );
}
