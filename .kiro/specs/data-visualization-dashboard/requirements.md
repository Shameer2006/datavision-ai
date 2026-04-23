# Data Visualization Dashboard - Requirements

## Overview
A Next.js-based data visualization application that allows users to upload CSV/Excel files and receive AI-generated interactive visualizations using Gemini 2.5 Flash and Plotly. The system supports two modes: inline charts in chat and full interactive dashboards.

## User Stories

### 1. File Upload and Processing
**As a user**, I want to upload CSV or Excel files through a chat interface so that I can analyze my data.

**Acceptance Criteria:**
- 1.1 User can attach CSV files (.csv) to chat messages
- 1.2 User can attach Excel files (.xlsx, .xls) to chat messages
- 1.3 File is parsed correctly on the server using papaparse (CSV) or xlsx (Excel)
- 1.4 Data profiling is performed automatically and structured as:
  - Column name
  - Data type (number, string, date, boolean)
  - Null count and percentage
  - Unique value count
  - Sample values (first 5 unique values)
  - For numeric columns: min, max, mean, median, std deviation
  - For string columns: top 5 most frequent values with counts
  - For date columns: min date, max date, date range
- 1.5 File attachment is displayed in the chat input area before sending
- 1.6 Data profile is sent to Gemini in structured JSON format (not raw CSV data)

### 2. Inline Chart Generation (Mode 1)
**As a user**, I want to request specific charts in the chat so that I can quickly visualize particular aspects of my data.

**Acceptance Criteria:**
- 2.1 User can request specific chart types (e.g., "bar chart of sales by branch")
- 2.2 System detects chart-specific requests and responds in "chart" mode
- 2.3 Interactive Plotly chart is rendered inline within the chat message
- 2.4 Chart includes title, visualization, and AI-generated insight text
- 2.5 Chart supports Plotly interactions (hover, zoom, download)
- 2.6 Chart uses blue color palette (#3B82F6 family)

### 3. Dashboard Generation (Mode 2)
**As a user**, I want to request a full dashboard analysis so that I can explore my data comprehensively.

**Acceptance Criteria:**
- 3.1 User can request dashboard creation (e.g., "create a dashboard", "analyze this data")
- 3.2 System detects dashboard requests and responds in "dashboard" mode
- 3.3 Dashboard preview card is displayed in chat with summary (KPI count, chart count, filter count)
- 3.4 Preview card includes "Open Dashboard →" button linking to full dashboard page
- 3.5 Dashboard data is persisted in localStorage
- 3.6 Dashboard includes multiple KPIs, charts, and filters

### 4. Full Dashboard Page
**As a user**, I want to view and interact with a full dashboard on a dedicated page so that I can explore my data in detail.

**Acceptance Criteria:**
- 4.1 Dashboard page is accessible at /dashboard/[id]
- 4.2 Page displays "← Back to Chat" navigation link
- 4.3 KPI cards are displayed in a row at the top
- 4.4 Filter bar allows filtering by categorical, date range, and numeric range
- 4.5 Charts are displayed in a 2-column grid layout
- 4.6 All charts are interactive Plotly visualizations
- 4.7 Dashboard uses consistent blue color scheme

### 5. Client-Side Filtering
**As a user**, I want to filter dashboard data without reloading so that I can explore different data subsets quickly.

**Acceptance Criteria:**
- 5.1 Filter changes update KPIs and charts instantly (no server call)
- 5.2 Dropdown filters work for categorical columns
- 5.3 Date range filters work for date columns
- 5.4 Range slider filters work for numeric columns
- 5.5 "Reset All" button clears all filters
- 5.6 Filtered data recalculates KPIs correctly
- 5.7 Charts update with filtered data using Plotly.react()

### 6. AI-Powered Analysis
**As a user**, I want AI to automatically determine the best visualizations for my data so that I don't need to manually configure charts.

**Acceptance Criteria:**
- 6.1 Gemini 2.5 Flash receives structured input containing:
  - Dataset metadata: filename, row count, column count
  - Column profiles: array of column objects with name, type, statistics, samples
  - User prompt: the natural language request
  - Mode hint: whether this appears to be a chart or dashboard request
- 6.2 AI classifies request as "chart" or "dashboard" mode
- 6.3 AI returns structured JSON response with:
  - mode: "chart" | "dashboard"
  - For chart mode: { title, type, description, insight, plotlyData[], plotlyLayout{} }
  - For dashboard mode: { title, description, kpis[], charts[], filters[], insights }
- 6.4 AI generates appropriate KPIs for dashboard mode with label, value, prefix, suffix
- 6.5 AI suggests relevant filters based on data columns with type (select, date_range, range_slider) and options
- 6.6 AI provides insights and descriptions for visualizations
- 6.7 All visualizations use blue color palette: ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB', '#1D4ED8', '#BFDBFE']
- 6.8 Gemini response follows a strict JSON schema for consistent parsing

### 7. Loading States
**As a user**, I want to see progress indicators while my data is being analyzed so that I know the system is working.

**Acceptance Criteria:**
- 7.1 Loading animation displays during analysis
- 7.2 Loading states progress through: "Reading data..." → "Analyzing columns..." → "Generating visualizations..."
- 7.3 Loading indicator is visually distinct in the chat
- 7.4 Loading state is replaced by results when complete

### 8. Dashboard Persistence
**As a user**, I want my dashboards to be saved so that I can return to them later.

**Acceptance Criteria:**
- 8.1 Dashboards are saved to localStorage with unique IDs
- 8.2 Dashboard data includes: id, title, description, createdAt, kpis, filters, charts, rawData
- 8.3 User can retrieve dashboard by ID from URL
- 8.4 User can list all saved dashboards
- 8.5 Dashboard data persists across browser sessions

## Technical Constraints

### Architecture
- Next.js only (no Python backend)
- Single server deployment
- No code execution (Gemini returns JSON specs, not code)

### Dependencies
- AI: @google/generative-ai (Gemini 2.5 Flash)
- CSV Parsing: papaparse
- Excel Parsing: xlsx
- Charts: react-plotly.js + plotly.js-dist-min
- IDs: uuid

### API
- Single API route: /api/analyze
- Accepts: FormData with file + prompt
- Returns: { mode, kpis?, charts, filters?, rawData? }

### Structured Data Format for Gemini

#### Input Schema (sent to Gemini)
```json
{
  "dataset": {
    "filename": "string",
    "rowCount": "number",
    "columnCount": "number"
  },
  "columns": [
    {
      "name": "string",
      "type": "number" | "string" | "date" | "boolean",
      "nullCount": "number",
      "nullPercentage": "number",
      "uniqueCount": "number",
      "samples": ["any", "any", "any", "any", "any"],
      // For numeric columns:
      "min": "number",
      "max": "number",
      "mean": "number",
      "median": "number",
      "stdDev": "number",
      // For string columns:
      "topValues": [
        { "value": "string", "count": "number" },
        { "value": "string", "count": "number" }
      ],
      // For date columns:
      "minDate": "string (ISO)",
      "maxDate": "string (ISO)",
      "dateRange": "string (human readable)"
    }
  ],
  "userPrompt": "string"
}
```

#### Output Schema (expected from Gemini)
```json
{
  "mode": "chart" | "dashboard",
  // For chart mode:
  "chart": {
    "title": "string",
    "type": "string",
    "description": "string",
    "insight": "string",
    "plotlyData": [
      {
        "x": ["array"],
        "y": ["array"],
        "type": "string",
        "marker": { "color": "string" }
      }
    ],
    "plotlyLayout": {
      "title": "string",
      "xaxis": { "title": "string" },
      "yaxis": { "title": "string" },
      "template": "plotly_white"
    }
  },
  // For dashboard mode:
  "dashboard": {
    "title": "string",
    "description": "string",
    "insights": "string",
    "kpis": [
      {
        "label": "string",
        "value": "string",
        "prefix": "string (optional)",
        "suffix": "string (optional)"
      }
    ],
    "filters": [
      {
        "column": "string",
        "type": "select" | "date_range" | "range_slider",
        "options": ["string array (for select)"],
        "min": "string | number (for range/date)",
        "max": "string | number (for range/date)"
      }
    ],
    "charts": [
      {
        "title": "string",
        "type": "string",
        "description": "string (optional)",
        "plotlyData": ["array"],
        "plotlyLayout": { "object" }
      }
    ]
  }
}
```

### Color Scheme
- Primary blue: #3B82F6
- Blue palette: ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB', '#1D4ED8', '#BFDBFE']
- Plotly layout: plotly_white style

## Non-Functional Requirements

### Performance
- File parsing should complete within 5 seconds for files up to 10MB
- Dashboard filtering should update UI within 500ms
- Chart rendering should be smooth and responsive

### Usability
- Chat interface should be intuitive and familiar
- Dashboard should be accessible and easy to navigate
- Charts should be interactive with standard Plotly controls

### Security
- Gemini API key stored in environment variables
- File uploads validated for type and size
- No sensitive data logged or exposed

## Out of Scope (Deferred)
- Google Sheets integration
- Multi-user authentication
- Server-side dashboard persistence (database)
- Export functionality beyond Plotly's built-in download
- Real-time collaboration
