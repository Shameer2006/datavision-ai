declare module "react-plotly.js" {
  import * as React from "react";

  interface PlotParams {
    data: any[];
    layout?: Record<string, any>;
    config?: Record<string, any>;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    onRelayout?: (event: any) => void;
    onHover?: (event: any) => void;
    className?: string;
    divId?: string;
  }

  const Plot: React.ComponentType<PlotParams>;
  export default Plot;
}
