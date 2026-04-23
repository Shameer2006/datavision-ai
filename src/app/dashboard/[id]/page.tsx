"use client";

// ============================================================
// Dashboard Page — full-page interactive dashboard at /dashboard/[id]
// Loads dashboard data from localStorage and renders KPIs,
// filters, and interactive Plotly charts
// ============================================================

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Download } from "lucide-react";
import { getDashboard } from "@/lib/dashboard-store";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PlotlyChart } from "@/components/dashboard/plotly-chart";
import { FilterBar } from "@/components/dashboard/filter-bar";
import type { DashboardData, KPI } from "@/lib/types";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const data = getDashboard(id);
    if (data) {
      setDashboard(data);
      // Initialize all filters to "All"
      const initial: Record<string, string> = {};
      (data.filters || []).forEach((f) => {
        initial[f.column] = "All";
      });
      setActiveFilters(initial);
    }
    setLoading(false);
  }, [id]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!dashboard?.rawData) return [];
    return dashboard.rawData.filter((row) => {
      return Object.entries(activeFilters).every(([col, val]) => {
        if (val === "All") return true;
        return String(row[col]) === val;
      });
    });
  }, [dashboard?.rawData, activeFilters]);

  // Recalculate KPIs from filtered data
  const filteredKpis = useMemo((): KPI[] => {
    if (!dashboard?.kpis || !dashboard?.rawData) return dashboard?.kpis || [];
    if (
      Object.values(activeFilters).every((v) => v === "All") ||
      filteredData.length === dashboard.rawData.length
    ) {
      return dashboard.kpis;
    }

    // Attempt to recalculate numeric KPIs from filtered data
    // This is a best-effort approach based on common KPI patterns
    return dashboard.kpis.map((kpi) => {
      const label = kpi.label.toLowerCase();
      const numericColumns = dashboard.rawData
        ? Object.keys(dashboard.rawData[0] || {}).filter((col) => {
            return typeof dashboard.rawData![0][col] === "number";
          })
        : [];

      // Try to match KPI label to a numeric column
      for (const col of numericColumns) {
        const colLower = col.toLowerCase().replace(/[_\s]/g, "");
        if (
          label.includes(colLower) ||
          colLower.includes(label.replace(/[^a-z]/g, ""))
        ) {
          const values = filteredData
            .map((r) => Number(r[col]))
            .filter((n) => !isNaN(n));
          if (values.length === 0) continue;

          if (label.includes("total") || label.includes("sum")) {
            const sum = values.reduce((a, b) => a + b, 0);
            return { ...kpi, value: sum.toFixed(2) };
          }
          if (label.includes("average") || label.includes("avg") || label.includes("mean")) {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            return { ...kpi, value: avg.toFixed(2) };
          }
          if (label.includes("max") || label.includes("maximum") || label.includes("highest")) {
            return { ...kpi, value: Math.max(...values).toFixed(2) };
          }
          if (label.includes("min") || label.includes("minimum") || label.includes("lowest")) {
            return { ...kpi, value: Math.min(...values).toFixed(2) };
          }
        }
      }

      // Count-based KPIs
      if (
        label.includes("total") &&
        (label.includes("transaction") || label.includes("count") || label.includes("record") || label.includes("order"))
      ) {
        return { ...kpi, value: String(filteredData.length) };
      }

      return kpi;
    });
  }, [dashboard, filteredData, activeFilters]);

  const handleFilterChange = (column: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [column]: value }));
  };

  const handleReset = () => {
    const reset: Record<string, string> = {};
    (dashboard?.filters || []).forEach((f) => {
      reset[f.column] = "All";
    });
    setActiveFilters(reset);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 relative">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <span className="text-sm text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          Dashboard not found
        </h1>
        <p className="text-sm text-muted-foreground">
          This dashboard may have been removed or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Link>
            <div className="h-4 w-px bg-foreground/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {dashboard.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Description */}
        {dashboard.description && (
          <p className="text-sm text-muted-foreground max-w-3xl">
            {dashboard.description}
          </p>
        )}

        {/* Filters */}
        {dashboard.filters && dashboard.filters.length > 0 && (
          <FilterBar
            filters={dashboard.filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        )}

        {/* KPIs */}
        {filteredKpis && filteredKpis.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredKpis.map((kpi, i) => (
              <KPICard
                key={`${kpi.label}-${i}`}
                label={kpi.label}
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
              />
            ))}
          </div>
        )}

        {/* Charts Grid */}
        {dashboard.charts && dashboard.charts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dashboard.charts.map((chart, i) => (
              <PlotlyChart
                key={`${chart.title}-${i}`}
                title={chart.title}
                description={chart.description}
                plotlyData={chart.plotlyData}
                plotlyLayout={chart.plotlyLayout}
              />
            ))}
          </div>
        )}

        {/* Data info */}
        <div className="text-center py-4">
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
            {filteredData.length !== dashboard.rawData?.length
              ? `Showing ${filteredData.length} of ${dashboard.rawData?.length} rows`
              : `${dashboard.rawData?.length} total rows`}{" "}
            · Generated by DataVision AI
          </p>
        </div>
      </main>
    </div>
  );
}
