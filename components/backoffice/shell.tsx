import Link from "next/link";
import type { ReactNode } from "react";
import { TruckIcon } from "@/components/icons";
import { SidebarNav, type NavItem } from "./sidebar-nav";

/**
 * Shared sidebar shell for every signed-in space: the internal back
 * offices (admin, manager, carrier — dark) and the end-user front-office
 * space (light).
 */
export function BackofficeShell({
  tone,
  homeHref,
  roleLabel,
  items,
  backHref,
  backLabel,
  identityLabel,
  identity,
  demoNote,
  children,
}: {
  tone: "dark" | "light";
  homeHref: string;
  roleLabel: string;
  items: NavItem[];
  backHref: string;
  backLabel: string;
  identityLabel: string;
  identity: string;
  demoNote: string;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen w-64 shrink-0 flex-col p-4 lg:flex ${
          dark ? "bg-brand-950" : "border-e border-slate-200 bg-white"
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
                dark ? "text-white" : "text-brand-950"
              }`}
            >
              Fret<span className="text-accent-400">Connect</span>
            </span>
            <span
              className={`block text-[11px] font-medium uppercase tracking-wide ${
                dark ? "text-brand-300" : "text-slate-400"
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
        <p className={`px-2 text-xs ${dark ? "text-brand-400" : "text-slate-400"}`}>
          {identityLabel}
          <span
            className={`block font-semibold ${dark ? "text-brand-200" : "text-slate-600"}`}
          >
            {identity}
          </span>
        </p>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
          {demoNote}
        </div>
        {/* Mobile nav */}
        <div className={`p-3 lg:hidden ${dark ? "bg-brand-950" : "border-b border-slate-200 bg-white"}`}>
          <SidebarNav
            items={items}
            baseHref={homeHref}
            backHref={backHref}
            backLabel={backLabel}
            tone={tone}
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
