"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/icons";
import { navIcons, type NavItem } from "./sidebar-nav";

/**
 * Native-style bottom tab bar for small screens. Shows the first 4 nav
 * items as tabs; a 5th "More" tab (opening the drawer) appears when a
 * space has more items than that.
 */
export function BottomTabBar({
  items,
  baseHref,
  tone,
  moreLabel,
  onMoreClick,
}: {
  items: NavItem[];
  baseHref: string;
  tone: "dark" | "light";
  moreLabel: string;
  onMoreClick: () => void;
}) {
  const pathname = usePathname();
  const visible = items.slice(0, 4);
  const hasMore = items.length > 4;

  const barTone =
    tone === "dark"
      ? "border-white/10 bg-brand-950"
      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

  const tabClass = (active: boolean) =>
    active
      ? tone === "dark"
        ? "text-accent-400"
        : "text-brand-900 dark:text-brand-200"
      : tone === "dark"
        ? "text-brand-300"
        : "text-slate-400 dark:text-slate-500";

  return (
    <nav
      className={`pb-safe fixed inset-x-0 bottom-0 z-30 flex border-t lg:hidden ${barTone}`}
    >
      {visible.map((it) => {
        const Icon = navIcons[it.icon];
        const active =
          it.href === baseHref ? pathname === baseHref : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${tabClass(active)}`}
          >
            <Icon width={20} height={20} />
            <span className="max-w-full truncate px-1">{it.label}</span>
          </Link>
        );
      })}
      {hasMore ? (
        <button
          onClick={onMoreClick}
          className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${tabClass(false)}`}
        >
          <MenuIcon width={20} height={20} />
          <span>{moreLabel}</span>
        </button>
      ) : null}
    </nav>
  );
}
