import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";

export function DashboardShell({
  dict,
  title,
  subtitle,
  roleLabel,
  identity,
  children,
}: {
  dict: Dictionary;
  title: string;
  subtitle: string;
  roleLabel: string;
  identity: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-50">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
        {dict.common.demoBanner}
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
              {roleLabel}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-950">{title}</h1>
            <p className="mt-1 text-slate-500">{subtitle}</p>
          </div>
          <p className="text-sm text-slate-400">
            {dict.dash.signedInAs} <span className="font-semibold text-slate-600">{identity}</span>
          </p>
        </div>
        <div className="mt-8 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
  aside,
}: {
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-brand-950">{title}</h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
