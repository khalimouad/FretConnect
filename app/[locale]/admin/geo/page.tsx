import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { GeoAdmin } from "@/components/admin/geo-admin";

export default async function AdminGeoPage({
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
        {dict.adminDash.geoTitle}
      </h1>
      <div className="mt-4">
        <GeoAdmin dict={dict} />
      </div>
    </>
  );
}
