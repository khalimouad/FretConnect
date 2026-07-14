import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { CurrenciesAdmin } from "@/components/admin/currencies-admin";

export default async function AdminCurrenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
        {dict.dash.currencies}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dict.currencyUI.label}</p>
      <div className="mt-6">
        <CurrenciesAdmin dict={dict} />
      </div>
    </>
  );
}
