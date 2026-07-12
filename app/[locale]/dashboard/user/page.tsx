import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { users } from "@/lib/data/mock";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default async function UserDashboardPage({
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
      title={dict.userDash.title}
      subtitle={dict.userDash.subtitle}
      roleLabel={dict.nav.spaceUser}
      identity={users[0].name}
    >
      <UserDashboard locale={locale} dict={dict} />
    </DashboardShell>
  );
}
