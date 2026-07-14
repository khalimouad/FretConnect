"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { TruckIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CurrencySelector } from "@/components/currency/selector";
import { SidebarNav, type NavItem } from "./sidebar-nav";
import { Topbar, CompactLangSwitcher } from "./topbar";
import { Drawer } from "@/components/nav/drawer";
import { BottomTabBar } from "./bottom-tab-bar";

/**
 * Shared sidebar shell for every signed-in space: the internal back
 * offices (admin, manager, carrier — dark) and the end-user front-office
 * space (light). Desktop keeps a permanent sidebar; small screens get a
 * sliding drawer plus a bottom tab bar for native-app-style navigation.
 */
export function BackofficeShell({
  tone,
  locale,
  dict,
  homeHref,
  roleLabel,
  items,
  backHref,
  backLabel,
  identityLabel,
  identity,
  demoNote,
  topbarExtra,
  children,
}: {
  tone: "dark" | "light";
  locale: Locale;
  dict: Dictionary;
  homeHref: string;
  roleLabel: string;
  items: NavItem[];
  backHref: string;
  backLabel: string;
  identityLabel: string;
  identity: string;
  demoNote: string;
  topbarExtra?: ReactNode;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const themeLabels = dict.theme;

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar (desktop only) */}
      <aside
        className={`sticky top-0 hidden h-screen w-64 shrink-0 flex-col p-4 lg:flex ${
          dark
            ? "bg-brand-950"
            : "border-e border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        }`}
      >
        <Link href={homeHref} className="flex items-center gap-2 px-2 py-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-accent-400 ${
              dark ? "bg-white/10" : "bg-brand-900"
            }`}
          >
            <TruckIcon width={22} height={22} />
          </span>
          <span>
            <span
              className={`block text-base font-bold leading-tight ${
                dark ? "text-white" : "text-brand-950 dark:text-white"
              }`}
            >
              Fret<span className="text-accent-400">Connect</span>
            </span>
            <span
              className={`block text-[11px] font-medium uppercase tracking-wide ${
                dark ? "text-brand-300" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {roleLabel}
            </span>
          </span>
        </Link>
        <div className="mt-4 flex-1">
          <SidebarNav
            items={items}
            baseHref={homeHref}
            backHref={backHref}
            backLabel={backLabel}
            tone={tone}
          />
        </div>
        <p className={`px-2 text-xs ${dark ? "text-brand-400" : "text-slate-400 dark:text-slate-500"}`}>
          {identityLabel}
          <span
            className={`block font-semibold ${dark ? "text-brand-200" : "text-slate-600 dark:text-slate-300"}`}
          >
            {identity}
          </span>
        </p>
      </aside>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="start"
        ariaLabel={dict.nav.menu}
      >
        <div
          className={`flex flex-1 flex-col p-4 ${dark ? "bg-brand-950" : "bg-white dark:bg-slate-900"}`}
        >
          <Link
            href={homeHref}
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2 px-2 py-3"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-accent-400 ${
                dark ? "bg-white/10" : "bg-brand-900"
              }`}
            >
              <TruckIcon width={22} height={22} />
            </span>
            <span>
              <span
                className={`block text-base font-bold leading-tight ${
                  dark ? "text-white" : "text-brand-950 dark:text-white"
                }`}
              >
                Fret<span className="text-accent-400">Connect</span>
              </span>
              <span
                className={`block text-[11px] font-medium uppercase tracking-wide ${
                  dark ? "text-brand-300" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {roleLabel}
              </span>
            </span>
          </Link>
          <div className="mt-4 flex-1" onClick={() => setDrawerOpen(false)}>
            <SidebarNav
              items={items}
              baseHref={homeHref}
              backHref={backHref}
              backLabel={backLabel}
              tone={tone}
            />
          </div>
          <div
            className={`mt-4 flex items-center gap-1 border-t pt-4 ${
              dark ? "border-white/10" : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <CurrencySelector dict={dict} />
            <ThemeToggle labels={themeLabels} />
            <CompactLangSwitcher locale={locale} />
          </div>
          <p className={`mt-4 px-2 text-xs ${dark ? "text-brand-400" : "text-slate-400 dark:text-slate-500"}`}>
            {identityLabel}
            <span
              className={`block font-semibold ${dark ? "text-brand-200" : "text-slate-600 dark:text-slate-300"}`}
            >
              {identity}
            </span>
          </p>
        </div>
      </Drawer>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Topbar
          locale={locale}
          dict={dict}
          demoLabel={demoNote}
          identity={identity}
          themeLabels={themeLabels}
          extra={topbarExtra}
          onMenuClick={() => setDrawerOpen(true)}
          menuLabel={dict.nav.menu}
        />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-8 lg:pb-8">{children}</div>
      </div>

      <BottomTabBar
        items={items}
        baseHref={homeHref}
        tone={tone}
        moreLabel={dict.nav.more}
        onMoreClick={() => setDrawerOpen(true)}
      />
    </div>
  );
}
