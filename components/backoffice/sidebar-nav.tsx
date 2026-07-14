"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  CardIcon,
  GearIcon,
  GlobeIcon,
  HomeIcon,
  InboxIcon,
  ListIcon,
  MapPinIcon,
  MessageIcon,
  ShieldIcon,
  TruckIcon,
  UsersIcon,
} from "@/components/icons";

export type NavIcon =
  | "home"
  | "truck"
  | "message"
  | "bell"
  | "list"
  | "card"
  | "users"
  | "shield"
  | "mappin"
  | "globe"
  | "inbox"
  | "gear";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export const navIcons = {
  home: HomeIcon,
  truck: TruckIcon,
  message: MessageIcon,
  bell: BellIcon,
  list: ListIcon,
  card: CardIcon,
  users: UsersIcon,
  shield: ShieldIcon,
  mappin: MapPinIcon,
  globe: GlobeIcon,
  inbox: InboxIcon,
  gear: GearIcon,
} as const;

export function SidebarNav({
  items,
  baseHref,
  backHref,
  backLabel,
  tone,
}: {
  items: NavItem[];
  baseHref: string;
  backHref: string;
  backLabel: string;
  tone: "dark" | "light";
}) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    tone === "dark"
      ? `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-white/10 text-white"
            : "text-brand-200 hover:bg-white/5 hover:text-white"
        }`
      : `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
        }`;

  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const Icon = navIcons[it.icon];
        const active =
          it.href === baseHref ? pathname === baseHref : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={linkClass(active)}>
            <Icon
              width={17}
              height={17}
              className={
                active
                  ? "text-accent-500"
                  : tone === "dark"
                    ? "text-brand-300"
                    : "text-slate-400 dark:text-slate-500"
              }
            />
            {it.label}
          </Link>
        );
      })}
      <div
        className={`mt-6 border-t pt-4 ${tone === "dark" ? "border-white/10" : "border-slate-200 dark:border-slate-800"}`}
      >
        <Link href={backHref} className={linkClass(false)}>
          <TruckIcon
            width={17}
            height={17}
            className={tone === "dark" ? "text-brand-300" : "text-slate-400 dark:text-slate-500"}
          />
          {backLabel}
        </Link>
      </div>
    </nav>
  );
}
