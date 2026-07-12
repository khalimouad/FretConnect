import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { ManagersAdmin } from "@/components/admin/managers-admin";

export default async function AdminManagersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950">
        {dict.adminDash.managersTitle}
      </h1>
      <div className="mt-6">
        <ManagersAdmin dict={dict} />
      </div>
    </>
  );
}
