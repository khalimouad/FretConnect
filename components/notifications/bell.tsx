"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cityName } from "@/lib/data/geo";
import type { AppNotification } from "@/lib/data/notifications";
import { BellIcon, CheckIcon } from "@/components/icons";

function relativeTime(iso: string, locale: Locale, justNow: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return justNow;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (diffMin < 60) return rtf.format(-diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return rtf.format(-diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  return rtf.format(-diffDay, "day");
}

export function NotificationBell({
  locale,
  dict,
  notifications,
  homeHref,
}: {
  locale: Locale;
  dict: Dictionary;
  notifications: AppNotification[];
  /** Link target for "see all" — the space's notifications page, if it has one. */
  homeHref?: string;
}) {
  const [items, setItems] = useState(notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex cursor-pointer items-center gap-1.5 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label={dict.notif.title}
      >
        <BellIcon width={17} height={17} />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 w-80 rounded-lg border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {dict.notif.title}
              {unread > 0 ? (
                <span className="ms-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                  {unread} {dict.notif.unread}
                </span>
              ) : null}
            </p>
            {unread > 0 ? (
              <button
                onClick={markAllRead}
                className="cursor-pointer text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
              >
                {dict.notif.markAllRead}
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                {dict.notif.empty}
              </p>
            ) : (
              items
                .slice()
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((n) => {
                  const body = (
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.read ? "bg-transparent" : "bg-accent-500"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm ${
                            n.read
                              ? "text-slate-500 dark:text-slate-400"
                              : "font-medium text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {dict.notif[n.kind]}
                        </p>
                        {n.departureCityId && n.arrivalCityId ? (
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {cityName(n.departureCityId)} → {cityName(n.arrivalCityId)}
                          </p>
                        ) : n.detail ? (
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {n.detail}
                          </p>
                        ) : null}
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          {relativeTime(n.createdAt, locale, dict.notif.justNow)}
                        </p>
                      </div>
                    </div>
                  );
                  return n.href ? (
                    <Link
                      key={n.id}
                      href={`/${locale}${n.href}`}
                      onClick={() => markRead(n.id)}
                      className="block border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-white/5"
                    >
                      {body}
                    </Link>
                  ) : (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="block w-full border-b border-slate-50 px-4 py-3 text-start last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-white/5"
                    >
                      {body}
                    </button>
                  );
                })
            )}
          </div>

          {homeHref ? (
            <Link
              href={homeHref}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-brand-700 hover:bg-slate-50 dark:border-slate-800 dark:text-brand-300 dark:hover:bg-white/5"
            >
              <CheckIcon width={13} height={13} />
              {dict.common.viewAll}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
