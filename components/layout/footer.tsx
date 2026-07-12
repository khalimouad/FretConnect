import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { TruckIcon } from "@/components/icons";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-accent-400">
              <TruckIcon width={18} height={18} />
            </span>
            <span className="font-bold text-brand-950">
              Fret<span className="text-accent-600">Connect</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-500">{dict.footer.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{dict.footer.product}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link href={`/${locale}/search`} className="hover:text-brand-800">
                {dict.nav.findFreight}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/pricing`} className="hover:text-brand-800">
                {dict.nav.pricing}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/register`} className="hover:text-brand-800">
                {dict.common.register}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{dict.footer.company}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><span>{dict.footer.about}</span></li>
            <li><span>{dict.footer.terms}</span></li>
            <li><span>{dict.footer.privacy}</span></li>
            <li><span>{dict.footer.contact}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © 2026 FretConnect. {dict.footer.rights}
      </div>
    </footer>
  );
}
