"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Money } from "@/lib/domain/types";
import { cities, cityName } from "@/lib/data/geo";
import { formatMoney } from "@/lib/format";
import { MAP_HEIGHT, MAP_WIDTH, outlinePath, project } from "./projection";

export interface MapRoute {
  id: string;
  departureCityId: string;
  arrivalCityId: string;
  price?: Money;
  href?: string;
}

function arcPath(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
): { d: string; mid: [number, number] } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bulge = Math.min(dist * 0.18, 40);
  const cx = (x1 + x2) / 2 + nx * bulge;
  const cy = (y1 + y2) / 2 + ny * bulge;
  return { d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, mid: [cx, cy] };
}

export function RouteMap({
  routes,
  locale,
  dict,
  compact = false,
}: {
  routes: MapRoute[];
  locale: Locale;
  dict: Dictionary;
  compact?: boolean;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const involvedCityIds = useMemo(() => {
    const set = new Set<string>();
    routes.forEach((r) => {
      set.add(r.departureCityId);
      set.add(r.arrivalCityId);
    });
    return set;
  }, [routes]);

  const arcs = useMemo(
    () =>
      routes
        .map((r) => {
          const dep = cities.find((c) => c.id === r.departureCityId);
          const arr = cities.find((c) => c.id === r.arrivalCityId);
          if (!dep || !arr) return null;
          const { d, mid } = arcPath(project(dep.lat, dep.lng), project(arr.lat, arr.lng));
          return { route: r, d, mid };
        })
        .filter((a): a is NonNullable<typeof a> => a !== null),
    [routes],
  );

  const hoveredArc = arcs.find((a) => a.route.id === hovered);

  return (
    <div dir="ltr" className={compact ? "h-56 w-full" : "h-[420px] w-full sm:h-[520px]"}>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-full w-full"
        role="img"
        aria-label={dict.map.title}
      >
        <path
          d={outlinePath}
          className="fill-slate-100 stroke-slate-300 dark:fill-slate-800/70 dark:stroke-slate-700"
          strokeWidth={1.5}
          onClick={() => setHovered(null)}
        />

        {/* All cities as small dots */}
        {cities.map((c) => {
          const [x, y] = project(c.lat, c.lng);
          const active = involvedCityIds.has(c.id);
          return (
            <g key={c.id}>
              <circle
                cx={x}
                cy={y}
                r={active ? 3.2 : 1.6}
                className={
                  active
                    ? "fill-brand-700 dark:fill-brand-300"
                    : "fill-slate-400 dark:fill-slate-600"
                }
              />
              {active && !compact ? (
                <text
                  x={x}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-slate-600 text-[10px] font-medium sm:text-[9px] dark:fill-slate-300"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {c.name}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Route arcs */}
        {arcs.map(({ route, d }) => {
          const isHovered = hovered === route.id;
          const handleActivate = () => {
            if (hovered !== route.id) {
              // First interaction (touch tap, or a click with no prior
              // hover): reveal the tooltip instead of navigating away.
              setHovered(route.id);
              return;
            }
            if (route.href) router.push(route.href);
          };
          return (
            <g key={route.id}>
              {/* Wider invisible hit area — the visible stroke is too thin to reliably tap */}
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                style={{ cursor: route.href ? "pointer" : "default" }}
                onMouseEnter={() => setHovered(route.id)}
                onMouseLeave={() => setHovered((h) => (h === route.id ? null : h))}
                onClick={handleActivate}
              />
              <path
                d={d}
                fill="none"
                className={
                  isHovered
                    ? "stroke-accent-500 dark:stroke-accent-400"
                    : "stroke-accent-400/60 dark:stroke-accent-500/50"
                }
                strokeWidth={isHovered ? 3 : 1.75}
                strokeLinecap="round"
                style={{ pointerEvents: "none", transition: "stroke-width 120ms" }}
              />
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredArc ? (
          <g
            transform={`translate(${Math.min(Math.max(hoveredArc.mid[0], 70), MAP_WIDTH - 70)}, ${Math.max(hoveredArc.mid[1] - 34, 14)})`}
            className="pointer-events-none"
          >
            <rect
              x={-66}
              y={-13}
              width={132}
              height={hoveredArc.route.price ? 34 : 20}
              rx={6}
              className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700"
              strokeWidth={1}
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              className="fill-slate-800 text-[10px] font-semibold dark:fill-slate-100"
            >
              {cityName(hoveredArc.route.departureCityId)} → {cityName(hoveredArc.route.arrivalCityId)}
            </text>
            {hoveredArc.route.price ? (
              <text
                x={0}
                y={14}
                textAnchor="middle"
                className="fill-accent-600 text-[10px] font-bold dark:fill-accent-400"
              >
                {formatMoney(hoveredArc.route.price, locale)}
              </text>
            ) : null}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
