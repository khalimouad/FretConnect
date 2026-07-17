"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";

/**
 * Collapses the search filter fields behind a toggle on mobile so results
 * aren't pushed off-screen; always expanded at lg: and up. The wrapped
 * fields stay mounted (just visually hidden) so the surrounding <form>'s
 * plain GET submission is unaffected.
 */
export function FiltersToggle({
  label,
  activeCount,
  children,
}: {
  label: string;
  activeCount: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-card lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none"
      >
        <span className="flex items-center gap-2">
          {label}
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={open ? "mt-3 block lg:mt-0" : "hidden lg:block"}>{children}</div>
    </>
  );
}
