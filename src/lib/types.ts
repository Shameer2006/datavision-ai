// ============================================================
// Shared types for the DataVision visualization pipeline
// ============================================================

/** The two response modes Gemini can return */
export type ResponseMode = "chart" | "dashboard";

// ── Inline Chart (Mode 1: rendered in chat) ─────────────────

export type InlineChart = {
  title: string;
  type: string;
  description: string;
  insight: string;
  plotlyData: any[];
  plotlyLayout: Record<string, any>;
};

// ── Dashboard (Mode 2: rendered on /dashboard/[id]) ─────────

export type KPI = {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
};

export type DashboardFilter = {
  column: string;
  type: "select" | "date_range" | "range_slider";
  options?: string[];
  min?: string | number;
  max?: string | number;
};

export type DashboardChart = {
  title: string;
  type: string;
  description?: string;
  plotlyData: any[];
  plotlyLayout: Record<string, any>;
};

export type DashboardData = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  kpis: KPI[];
  filters: DashboardFilter[];
  charts: DashboardChart[];
  rawData: Record<string, any>[];
};

// ── Chat Message ────────────────────────────────────────────

export type DashboardPreview = {
  dashboardId: string;
  title: string;
  description: string;
  chartCount: number;
  kpiCount: number;
  filterCount: number;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  inlineChart?: InlineChart;
  dashboardPreview?: DashboardPreview;
  isLoading?: boolean;
};

// ── Attachment ──────────────────────────────────────────────

export type Attachment = {
  id: string;
  name: string;
  type: "file" | "google-sheet";
  file?: File;
};

// ── API Response ────────────────────────────────────────────

export type AnalyzeResponse = {
  mode: ResponseMode;
  // Shared
  title: string;
  description: string;
  insight: string;
  // Chart mode
  chart?: {
    title: string;
    type: string;
    description: string;
    plotlyData: any[];
    plotlyLayout: Record<string, any>;
  };
  // Dashboard mode
  kpis?: KPI[];
  filters?: DashboardFilter[];
  charts?: DashboardChart[];
  rawData?: Record<string, any>[];
};
