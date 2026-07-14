"use client";

import { useEffect, useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";

type ThemePref = "light" | "dark" | "system";

const order: ThemePref[] = ["light", "dark", "system"];

function applyTheme(pref: ThemePref) {
  const dark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

/** Cycles light → dark → system, persisted to localStorage. */
export function ThemeToggle({
  labels,
  className = "",
}: {
  labels: { light: string; dark: string; system: string };
  className?: string;
}) {
  const [pref, setPref] = useState<ThemePref>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as ThemePref | null) ?? "system";
    setPref(stored);
    setMounted(true);
  }, []);

  function cycle() {
    const next = order[(order.indexOf(pref) + 1) % order.length];
    setPref(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  const Icon = pref === "dark" ? MoonIcon : pref === "system" ? MonitorIcon : SunIcon;
  const label = labels[pref];

  return (
    <button
      type="button"
      onClick={cycle}
      title={label}
      aria-label={label}
      className={`flex cursor-pointer items-center gap-1.5 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 ${className}`}
    >
      {mounted ? <Icon width={17} height={17} /> : <span className="h-[17px] w-[17px]" />}
    </button>
  );
}
