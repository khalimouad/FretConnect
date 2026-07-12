import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { tab } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        {dict.auth.registerTitle}
      </h1>
      <p className="mt-1 text-slate-500">{dict.auth.registerSubtitle}</p>
      <div className="mt-8">
        <RegisterForm
          locale={locale}
          dict={dict}
          initialTab={tab === "company" ? "company" : "user"}
        />
      </div>
    </div>
  );
}
