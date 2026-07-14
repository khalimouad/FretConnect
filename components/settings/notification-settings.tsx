"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { NotificationKind } from "@/lib/data/notifications";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { useToast } from "@/components/toast";

type Channel = "email" | "push" | "whatsapp" | "telegram";
type ChannelState = Record<Channel, boolean>;

const channels: { key: Channel; labelKey: keyof Dictionary["settingsUI"] }[] = [
  { key: "email", labelKey: "channelEmail" },
  { key: "push", labelKey: "channelPush" },
  { key: "whatsapp", labelKey: "channelWhatsapp" },
  { key: "telegram", labelKey: "channelTelegram" },
];

/** Notification preferences matrix: event types × channels, plus WA/Telegram contact fields. */
export function NotificationSettings({
  dict,
  events,
  initialWhatsapp = "",
  initialTelegram = "",
}: {
  dict: Dictionary;
  events: NotificationKind[];
  initialWhatsapp?: string;
  initialTelegram?: string;
}) {
  const { push } = useToast();
  const [matrix, setMatrix] = useState<Record<string, ChannelState>>(() =>
    Object.fromEntries(
      events.map((e) => [e, { email: true, push: true, whatsapp: false, telegram: false }]),
    ),
  );
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [telegram, setTelegram] = useState(initialTelegram);

  function toggle(event: string, channel: Channel) {
    setMatrix((prev) => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    push(dict.settingsUI.saved);
  }

  return (
    <form onSubmit={save}>
      <Card className="overflow-x-auto p-5">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <th className="py-2 text-start font-medium">{dict.notif.title}</th>
              {channels.map((c) => (
                <th key={c.key} className="px-3 py-2 text-center font-medium">
                  {dict.settingsUI[c.labelKey]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="py-3 text-slate-700 dark:text-slate-200">{dict.notif[event]}</td>
                {channels.map((c) => (
                  <td key={c.key} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[event][c.key]}
                      onChange={() => toggle(event, c.key)}
                      className="h-4 w-4 cursor-pointer accent-brand-700"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label={dict.settingsUI.whatsappNumber} hint="+212 6XX XXX XXX">
          <input
            type="tel"
            dir="ltr"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+212 6…"
            className={inputClass}
          />
        </Field>
        <Field label={dict.settingsUI.telegramHandle} hint="@username">
          <input
            type="text"
            dir="ltr"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username"
            className={inputClass}
          />
        </Field>
      </div>

      <Button type="submit" className="mt-4">
        {dict.common.save}
      </Button>
    </form>
  );
}
