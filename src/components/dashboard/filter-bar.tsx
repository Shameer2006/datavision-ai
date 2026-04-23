"use client";

// ============================================================
// Filter Bar — renders dropdown/select filters for the dashboard
// Allows interactive filtering of dashboard data
// ============================================================

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { DashboardFilter } from "@/lib/types";

interface FilterBarProps {
  filters: DashboardFilter[];
  activeFilters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
  onReset: () => void;
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
}: FilterBarProps) {
  if (!filters || filters.length === 0) return null;

  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => v !== "All"
  );

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <div key={filter.column} className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {filter.column}
            </label>
            {filter.type === "select" && (
              <select
                value={activeFilters[filter.column] || "All"}
                onChange={(e) => onFilterChange(filter.column, e.target.value)}
                className="h-8 px-2.5 text-xs font-medium bg-background border border-foreground/10 rounded-lg text-foreground focus:border-blue-300 focus:ring-1 focus:ring-blue-200 outline-none transition-colors min-w-[120px] cursor-pointer"
              >
                <option value="All">All</option>
                {(filter.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
