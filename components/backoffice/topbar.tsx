"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { localeMeta, locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CurrencySelector } from "@/components/currency/selector";
import { ChevronDownIcon, GlobeIcon, MenuIcon } from "@/components/icons";

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onOutside]);
  return ref;
}

export function CompactLangSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useClickOutside(() => setOpen(false));
  const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Language"
      >
        <GlobeIcon width={16} height={16} />
        <ChevronDownIcon width={12} height={12} />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${rest}`}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 ${
                l === locale
                  ? "font-semibold text-brand-900 dark:text-brand-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {localeMeta[l].label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function Topbar({
  locale,
  dict,
  demoLabel,
  identity,
  themeLabels,
  extra,
  onMenuClick,
  menuLabel,
}: {
  locale: Locale;
  dict: Dictionary;
  demoLabel: string;
  identity: string;
  themeLabels: { light: string; dark: string; system: string };
  /** Extra slots (notification bell) rendered before the currency/theme controls. */
  extra?: ReactNode;
  /** Opens the mobile drawer. When set, a hamburger button is shown below lg. */
  onMenuClick?: () => void;
  menuLabel?: string;
}) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8 dark:border-slate-800 dark:bg-slate-900/95">
      {onMenuClick ? (
        <button
          onClick={onMenuClick}
          className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-white/10"
          aria-label={menuLabel ?? "Menu"}
        >
          <MenuIcon width={20} height={20} />
        </button>
      ) : null}
      <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 sm:inline-flex dark:bg-amber-950 dark:text-amber-300">
        {demoLabel}
      </span>

      <div className="ms-auto flex items-center gap-1">
        {extra}
        <div className="hidden items-center gap-1 lg:flex">
          <CurrencySelector dict={dict} />
          <ThemeToggle labels={themeLabels} />
          <CompactLangSwitcher locale={locale} />
        </div>
        <span className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-white dark:bg-brand-700">
          {initials(identity)}
        </span>
      </div>
    </div>
  );
}
