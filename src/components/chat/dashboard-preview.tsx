"use client";

// ============================================================
// Dashboard Preview — card shown in chat that links to
// the full dashboard page (Mode 2)
// ============================================================

import { BarChart3, ArrowRight, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface DashboardPreviewProps {
  dashboardId: string;
  title: string;
  description: string;
  chartCount: number;
  kpiCount: number;
  filterCount: number;
}

export function DashboardPreview({
  dashboardId,
  title,
  description,
  chartCount,
  kpiCount,
  filterCount,
}: DashboardPreviewProps) {
  return (
    <div className="w-full max-w-2xl my-3">
      <Link href={`/dashboard/${dashboardId}`} className="block group">
        <div className="border border-blue-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50/50 to-background shadow-sm hover:shadow-md hover:border-blue-300/60 transition-all duration-300">
          {/* Header with icon */}
          <div className="px-5 pt-5 pb-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="px-5 pb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <BarChart3 className="w-3 h-3" />
              {kpiCount} KPIs
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <BarChart3 className="w-3 h-3" />
              {chartCount} Charts
            </span>
            {filterCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <SlidersHorizontal className="w-3 h-3" />
                {filterCount} Filters
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="px-5 py-3 border-t border-blue-100/60 flex items-center justify-between bg-blue-50/30">
            <span className="text-xs text-muted-foreground">
              Interactive dashboard ready
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
              Open Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
