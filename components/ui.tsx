import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { CompanyStatus, OfferStatus, SubscriptionState } from "@/lib/domain/types";
import type { Dictionary } from "@/lib/i18n";

/* ---------- Buttons ---------- */

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-900 text-white hover:bg-brand-800 focus-visible:outline-brand-900",
  accent:
    "bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-accent-600",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  danger:
    "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <button
      className={`${buttonBase} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: keyof typeof sizeClasses;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

/* ---------- Surfaces ---------- */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warn";
}) {
  const valueColor =
    tone === "accent"
      ? "text-accent-600"
      : tone === "warn"
        ? "text-amber-600"
        : "text-brand-900";
  return (
    <Card className="p-5">
      <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Card>
  );
}

/* ---------- Forms ---------- */

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30";

/* ---------- Status badges ---------- */

const offerStatusTone: Record<OfferStatus, string> = {
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  filled: "bg-brand-100 text-brand-800 ring-brand-200",
  expired: "bg-amber-50 text-amber-700 ring-amber-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
  archived: "bg-slate-100 text-slate-500 ring-slate-200",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function OfferStatusBadge({
  status,
  dict,
}: {
  status: OfferStatus;
  dict: Dictionary;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${offerStatusTone[status]}`}
    >
      {dict.status[status]}
    </span>
  );
}

const companyStatusTone: Record<CompanyStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  validated: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
  rejected: "bg-slate-100 text-slate-500 ring-slate-200",
  closed: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function CompanyStatusBadge({
  status,
  dict,
}: {
  status: CompanyStatus;
  dict: Dictionary;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${companyStatusTone[status]}`}
    >
      {dict.status[status]}
    </span>
  );
}

const subTone: Record<SubscriptionState, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  expiring: "bg-amber-50 text-amber-700 ring-amber-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

export function SubscriptionBadge({
  state,
  dict,
}: {
  state: SubscriptionState;
  dict: Dictionary;
}) {
  const label =
    state === "active"
      ? dict.status.active
      : state === "expiring"
        ? dict.managerDash.statExpiring
        : state === "overdue"
          ? dict.status.overdue
          : dict.status.cancelled;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${subTone[state]}`}
    >
      {label}
    </span>
  );
}
