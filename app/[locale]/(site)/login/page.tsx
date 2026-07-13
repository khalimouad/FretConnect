import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { Button, Card, Field, inputClass } from "@/components/ui";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const demoSpaces = [
    { href: `/${locale}/dashboard/user`, label: dict.nav.spaceUser },
    { href: `/${locale}/dashboard/company`, label: dict.nav.spaceCompany },
    { href: `/${locale}/dashboard/manager`, label: dict.nav.spaceManager },
    { href: `/${locale}/admin`, label: dict.nav.spaceAdmin },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        {dict.auth.loginTitle}
      </h1>
      <p className="mt-1 text-slate-500">{dict.auth.loginSubtitle}</p>

      <Card className="mt-8 p-6">
        <form className="space-y-4" action={`/${locale}/dashboard/user`}>
          <Field label={dict.auth.emailOrPhone}>
            <input type="text" className={inputClass} autoComplete="username" />
          </Field>
          <Field label={dict.auth.password}>
            <input type="password" className={inputClass} autoComplete="current-password" />
          </Field>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-700 hover:underline">
              {dict.auth.forgotPassword}
            </span>
          </div>
          <Button type="submit" className="w-full" size="lg">
            {dict.common.login}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          {dict.auth.noAccount}{" "}
          <Link href={`/${locale}/register`} className="font-semibold text-accent-600 hover:underline">
            {dict.common.register}
          </Link>
        </p>
      </Card>

      <div className="mt-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {dict.auth.demoHint}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {demoSpaces.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 shadow-card hover:border-brand-300 hover:text-brand-900"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
