import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { companyNotifications } from "@/lib/data/notifications";
import { NotificationsListPage } from "@/components/notifications/list-page";

export default async function CompanyNotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <NotificationsListPage locale={locale} dict={dict} notifications={companyNotifications} />;
}
