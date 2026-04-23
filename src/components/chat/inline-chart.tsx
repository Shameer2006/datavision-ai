"use client";

// ============================================================
// Inline Chart — renders a single interactive Plotly chart
// inside a chat message (Mode 1)
// ============================================================

import dynamic from "next/dynamic";
import type { InlineChart as InlineChartType } from "@/lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface InlineChartProps {
  chart: InlineChartType;
}

export function InlineChart({ chart }: InlineChartProps) {
  return (
    <div className="w-full max-w-2xl my-3">
      <div className="border border-foreground/10 rounded-2xl overflow-hidden bg-background shadow-sm">
        {/* Header */}
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {chart.title}
          </h3>
          {chart.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {chart.description}
            </p>
          )}
        </div>

        {/* Chart */}
        <div className="px-3 pb-3">
          <Plot
            data={chart.plotlyData}
            layout={{
              ...chart.plotlyLayout,
              autosize: true,
              margin: { t: 20, r: 20, b: 50, l: 50, ...(chart.plotlyLayout?.margin || {}) },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 11,
                color: "#64748b",
                ...(chart.plotlyLayout?.font || {}),
              },
              xaxis: {
                gridcolor: "rgba(0,0,0,0.05)",
                ...(chart.plotlyLayout?.xaxis || {}),
              },
              yaxis: {
                gridcolor: "rgba(0,0,0,0.05)",
                ...(chart.plotlyLayout?.yaxis || {}),
              },
            }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: [
                "lasso2d",
                "select2d",
                "autoScale2d",
              ],
              responsive: true,
            }}
            style={{ width: "100%", height: "360px" }}
            useResizeHandler
          />
        </div>

        {/* Insight */}
        {chart.insight && (
          <div className="px-5 pb-4 pt-1 border-t border-foreground/5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 {chart.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
