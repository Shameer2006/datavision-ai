"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// Dynamically import Plot to avoid SSR issues (Plotly requires window/document)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] w-full items-center justify-center rounded-xl border bg-muted/30">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <svg
          className="h-6 w-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="text-sm">Loading chart...</span>
      </div>
    </div>
  ),
});

interface PlotlyChartProps {
  config: {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
  };
}

export function PlotlyChart({ config }: PlotlyChartProps) {
  return (
    <div className="my-3 w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <Plot
        data={config.data}
        layout={{
          ...config.layout,
          autosize: true,
          height: 380,
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: {
            family: "Inter, sans-serif",
            color: "hsl(var(--foreground))",
          },
          margin: { l: 50, r: 30, t: 50, b: 50 },
          ...(config.layout || {}),
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
        }}
        style={{ width: "100%", height: "380px" }}
        useResizeHandler={true}
      />
    </div>
  );
}
