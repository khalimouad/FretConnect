"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeMeta, locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import {
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  TruckIcon,
  XIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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

function LangSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useClickOutside(() => setOpen(false));
  const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Language"
      >
        <GlobeIcon width={16} height={16} />
        {localeMeta[locale].label}
        <ChevronDownIcon width={14} height={14} />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900">
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

function SpacesMenu({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const items = [
    { href: `/${locale}/dashboard/user`, label: dict.nav.spaceUser },
    { href: `/${locale}/dashboard/company`, label: dict.nav.spaceCompany },
    { href: `/${locale}/dashboard/manager`, label: dict.nav.spaceManager },
    { href: `/${locale}/admin`, label: dict.nav.spaceAdmin },
  ];
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      >
        {dict.nav.spaces}
        <ChevronDownIcon width={14} height={14} />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {dict.common.demo}
          </p>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {it.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    { href: `/${locale}/search`, label: dict.nav.findFreight },
    { href: `/${locale}/pricing`, label: dict.nav.forCarriers },
  ];
  const themeLabels = { light: dict.theme.light, dark: dict.theme.dark, system: dict.theme.system };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 text-accent-400">
            <TruckIcon width={22} height={22} />
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-950 dark:text-white">
            Fret<span className="text-accent-600 dark:text-accent-400">Connect</span>
          </span>
        </Link>

        <nav className="ms-6 hidden items-center gap-1 md:flex">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              {it.label}
            </Link>
          ))}
          <SpacesMenu locale={locale} dict={dict} />
        </nav>

        <div className="ms-auto hidden items-center gap-2 md:flex">
          <ThemeToggle labels={themeLabels} />
          <LangSwitcher locale={locale} />
          <Link
            href={`/${locale}/login`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {dict.common.login}
          </Link>
          <Link
            href={`/${locale}/register`}
            className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            {dict.common.register}
          </Link>
        </div>

        <div className="ms-auto flex items-center gap-1 md:hidden">
          <ThemeToggle labels={themeLabels} />
          <LangSwitcher locale={locale} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label="Menu"
          >
            {mobileOpen ? <MenuIconClose /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            {nav.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {it.label}
              </Link>
            ))}
            {[
              { href: `/${locale}/dashboard/user`, label: dict.nav.spaceUser },
              { href: `/${locale}/dashboard/company`, label: dict.nav.spaceCompany },
              { href: `/${locale}/dashboard/manager`, label: dict.nav.spaceManager },
              { href: `/${locale}/admin`, label: dict.nav.spaceAdmin },
              { href: `/${locale}/login`, label: dict.common.login },
            ].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                {it.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/register`}
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              {dict.common.register}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MenuIconClose() {
  return <XIcon />;
}
