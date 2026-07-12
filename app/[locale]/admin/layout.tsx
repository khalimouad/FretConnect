import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { AdminNav } from "@/components/admin/admin-nav";
import { TruckIcon } from "@/components/icons";

/**
 * Internal Administrator backoffice (§3.1) — its own shell, separate from
 * the public site chrome. Auth-gated in production; open in the demo.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-950 p-4 lg:flex">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2 px-2 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-accent-400">
            <TruckIcon width={22} height={22} />
          </span>
          <span>
            <span className="block text-base font-bold leading-tight text-white">
              Fret<span className="text-accent-400">Connect</span>
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-brand-300">
              {dict.adminDash.title}
            </span>
          </span>
        </Link>
        <div className="mt-4 flex-1">
          <AdminNav locale={locale} dict={dict} />
        </div>
        <p className="px-2 text-xs text-brand-400">
          {dict.dash.signedInAs}
          <span className="block font-semibold text-brand-200">admin@fretconnect.ma</span>
        </p>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
          {dict.adminUI.internal} · {dict.common.demoBanner}
        </div>
        {/* Mobile nav */}
        <div className="bg-brand-950 p-3 lg:hidden">
          <AdminNav locale={locale} dict={dict} />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
