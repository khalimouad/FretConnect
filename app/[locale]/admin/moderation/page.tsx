import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { ModerationAdmin } from "@/components/admin/moderation-admin";

export default async function AdminModerationPage({
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
        {dict.dash.moderation}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{dict.adminUI.allOffers}</p>
      <div className="mt-6">
        <ModerationAdmin locale={locale} dict={dict} />
      </div>
    </>
  );
}
