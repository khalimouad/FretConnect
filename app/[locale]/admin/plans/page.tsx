import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { PlansAdmin } from "@/components/admin/plans-admin";

export default async function AdminPlansPage({
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
        {dict.adminDash.plansTitle}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{dict.plans.subtitle}</p>
      <div className="mt-6">
        <PlansAdmin locale={locale} dict={dict} />
      </div>
    </>
  );
}
