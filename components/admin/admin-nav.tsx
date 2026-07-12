"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import {
  BellIcon,
  GlobeIcon,
  MapPinIcon,
  SearchIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";

export function AdminNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;
  const items = [
    { href: base, label: dict.dash.overview, icon: SearchIcon },
    { href: `${base}/managers`, label: dict.dash.managers, icon: ShieldIcon },
    { href: `${base}/moderation`, label: dict.dash.moderation, icon: BellIcon },
    { href: `${base}/geo`, label: dict.dash.geo, icon: MapPinIcon },
    { href: `${base}/plans`, label: dict.dash.plansAdmin, icon: GlobeIcon },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const active = it.href === base ? pathname === base : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white/10 text-white"
                : "text-brand-200 hover:bg-white/5 hover:text-white"
            }`}
          >
            <it.icon width={17} height={17} className={active ? "text-accent-400" : ""} />
            {it.label}
          </Link>
        );
      })}
      <div className="mt-6 border-t border-white/10 pt-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-300 hover:bg-white/5 hover:text-white"
        >
          <TruckIcon width={17} height={17} />
          {dict.adminUI.backToSite}
        </Link>
      </div>
    </nav>
  );
}
