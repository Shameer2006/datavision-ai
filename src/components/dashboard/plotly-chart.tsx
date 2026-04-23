"use client";

// ============================================================
// Plotly Chart Wrapper — renders interactive Plotly charts
// on the dashboard page with consistent styling
// ============================================================

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyChartProps {
  title: string;
  description?: string;
  plotlyData: any[];
  plotlyLayout: Record<string, any>;
}

export function PlotlyChart({
  title,
  description,
  plotlyData,
  plotlyLayout,
}: PlotlyChartProps) {
  return (
    <div className="bg-background border border-foreground/10 rounded-xl overflow-hidden hover:border-blue-200/60 transition-colors">
      {/* Header */}
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="px-2 pb-2">
        <Plot
          data={plotlyData}
          layout={{
            ...plotlyLayout,
            autosize: true,
            margin: {
              t: 20,
              r: 20,
              b: 50,
              l: 55,
              ...(plotlyLayout?.margin || {}),
            },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: {
              family: "Inter, system-ui, sans-serif",
              size: 11,
              color: "#64748b",
              ...(plotlyLayout?.font || {}),
            },
            xaxis: {
              gridcolor: "rgba(0,0,0,0.04)",
              linecolor: "rgba(0,0,0,0.08)",
              ...(plotlyLayout?.xaxis || {}),
            },
            yaxis: {
              gridcolor: "rgba(0,0,0,0.04)",
              linecolor: "rgba(0,0,0,0.08)",
              ...(plotlyLayout?.yaxis || {}),
            },
            legend: {
              orientation: "h" as const,
              y: -0.2,
              x: 0.5,
              xanchor: "center" as const,
              ...(plotlyLayout?.legend || {}),
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
          style={{ width: "100%", height: "340px" }}
          useResizeHandler
        />
      </div>
    </div>
  );
}
