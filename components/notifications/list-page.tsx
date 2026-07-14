"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cityName } from "@/lib/data/geo";
import type { AppNotification } from "@/lib/data/notifications";
import { Button, Card } from "@/components/ui";
import { formatDate } from "@/lib/format";

export function NotificationsListPage({
  locale,
  dict,
  notifications,
}: {
  locale: Locale;
  dict: Dictionary;
  notifications: AppNotification[];
}) {
  const [items, setItems] = useState(
    [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-950 dark:text-white">
          {dict.notif.title}
        </h1>
        {unread > 0 ? (
          <Button size="sm" variant="outline" onClick={markAllRead}>
            {dict.notif.markAllRead}
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <Card className="mt-6 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {dict.notif.empty}
        </Card>
      ) : (
        <div className="mt-6 space-y-2">
          {items.map((n) => {
            const inner = (
              <div className="flex items-start gap-3">
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
                        : "font-semibold text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {dict.notif[n.kind]}
                  </p>
                  {n.departureCityId && n.arrivalCityId ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {cityName(n.departureCityId)} → {cityName(n.arrivalCityId)}
                    </p>
                  ) : n.detail ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{n.detail}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {formatDate(n.createdAt.slice(0, 10), locale)}
                  </p>
                </div>
              </div>
            );
            return n.href ? (
              <Link
                key={n.id}
                href={`/${locale}${n.href}`}
                onClick={() => markRead(n.id)}
                className="block"
              >
                <Card className="p-4 transition-shadow hover:shadow-card-hover">{inner}</Card>
              </Link>
            ) : (
              <button key={n.id} onClick={() => markRead(n.id)} className="block w-full text-start">
                <Card className="p-4 transition-shadow hover:shadow-card-hover">{inner}</Card>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
