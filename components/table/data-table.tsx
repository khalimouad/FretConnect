"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Card, inputClass } from "@/components/ui";
import {
  ChevronDownIcon,
  DownloadIcon,
  ListIcon,
  SearchIcon,
} from "@/components/icons";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "start" | "end";
  /** Custom cell renderer. Defaults to String(row[key]). */
  render?: (row: T) => ReactNode;
  /** Value used for sort/search/CSV export. Defaults to String(row[key]). */
  value?: (row: T) => string | number;
  /** When set, renders a <select> filter for this column with these options. */
  filterOptions?: { value: string; label: string }[];
  filterValue?: (row: T) => string;
  hiddenByDefault?: boolean;
}

type SortDir = "asc" | "desc";

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const handler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
  };
  return { ref, handler };
}

/**
 * Generic client-side data table: sortable columns, free-text search,
 * per-column select filters, pagination, column visibility, CSV export.
 * `row-actions` is just another column with a custom render().
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  dict,
  pageSize = 8,
  searchableValue,
  exportFilename = "export.csv",
}: {
  columns: Column<T>[];
  rows: T[];
  dict: Dictionary;
  pageSize?: number;
  /** Text used for the free-text search box; defaults to concatenating all column values. */
  searchableValue?: (row: T) => string;
  exportFilename?: string;
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.hiddenByDefault).map((c) => c.key)),
  );
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const colMenu = useClickOutside(() => setColMenuOpen(false));

  const visibleColumns = columns.filter((c) => !hidden.has(c.key));

  const cellValue = (col: Column<T>, row: T): string | number =>
    col.value ? col.value(row) : String((row as Record<string, unknown>)[col.key] ?? "");

  const filtered = useMemo(() => {
    let result = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((row) => {
        const haystack = searchableValue
          ? searchableValue(row)
          : columns.map((c) => cellValue(c, row)).join(" ");
        return haystack.toLowerCase().includes(q);
      });
    }
    for (const [key, val] of Object.entries(filters)) {
      if (!val) continue;
      const col = columns.find((c) => c.key === key);
      if (!col?.filterValue) continue;
      result = result.filter((row) => col.filterValue!(row) === val);
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, filters, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = cellValue(col, a);
      const bv = cellValue(col, b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function toggleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function toggleColumn(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function exportCsv() {
    const cols = visibleColumns;
    const header = cols.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
    const lines = sorted.map((row) =>
      cols.map((c) => `"${String(cellValue(c, row)).replace(/"/g, '""')}"`).join(","),
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFilename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filterCols = columns.filter((c) => c.filterOptions);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <SearchIcon
            width={15}
            height={15}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={dict.table.search}
            className={`${inputClass} ps-9`}
          />
        </div>
        {filterCols.map((c) => (
          <select
            key={c.key}
            value={filters[c.key] ?? ""}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, [c.key]: e.target.value }));
              setPage(1);
            }}
            className={`${inputClass} w-auto`}
          >
            <option value="">
              {c.label}: {dict.table.allValues}
            </option>
            {c.filterOptions!.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        <div className="relative" ref={colMenu.ref}>
          <button
            type="button"
            onClick={() => setColMenuOpen((v) => !v)}
            onBlur={(e) => colMenu.handler({ target: e.relatedTarget } as unknown as MouseEvent)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ListIcon width={15} height={15} />
            {dict.table.columns}
            <ChevronDownIcon width={13} height={13} />
          </button>
          {colMenuOpen ? (
            <div className="absolute end-0 top-full z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-card dark:border-slate-800 dark:bg-slate-900">
              {columns.map((c) => (
                <label
                  key={c.key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={!hidden.has(c.key)}
                    onChange={() => toggleColumn(c.key)}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <DownloadIcon width={15} height={15} />
          {dict.table.export}
        </button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
              {visibleColumns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 py-3 font-medium ${c.align === "end" ? "text-end" : "text-start"}`}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {c.label}
                      {sortKey === c.key ? (
                        <ChevronDownIcon
                          width={12}
                          height={12}
                          className={sortDir === "desc" ? "rotate-180" : ""}
                        />
                      ) : null}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500"
                >
                  {dict.table.noData}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  {visibleColumns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 ${c.align === "end" ? "text-end" : "text-start"}`}
                    >
                      {c.render ? c.render(row) : cellValue(c, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 ? (
        <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            {dict.table.pageOf
              .replace("{page}", String(clampedPage))
              .replace("{total}", String(totalPages))}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={clampedPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {dict.table.previous}
            </button>
            <button
              type="button"
              disabled={clampedPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {dict.table.next}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
