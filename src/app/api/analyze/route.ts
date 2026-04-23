// ============================================================
// POST /api/analyze — Main analysis endpoint
// Parses uploaded CSV/Excel, profiles the data, calls Gemini 2.5
// Flash, and returns Plotly JSON specs for visualization
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { parseFile, profileData } from "@/lib/data-profiler";
import { analyzeWithGemini } from "@/lib/gemini";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60; // Allow up to 60s for Gemini call

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const prompt = (formData.get("prompt") as string) || "Analyze this data";

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please attach a CSV or Excel file." },
        { status: 400 }
      );
    }

    // Validate file type
    const filename = file.name;
    const ext = filename.toLowerCase().split(".").pop();
    if (!ext || !["csv", "xlsx", "xls"].includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: .${ext}. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.`,
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // 1. Parse the file
    const buffer = Buffer.from(await file.arrayBuffer());
    let rows: Record<string, any>[];
    try {
      rows = parseFile(buffer, filename);
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to parse file." },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "The uploaded file contains no data rows." },
        { status: 400 }
      );
    }

    // 2. Profile the data
    const profile = profileData(rows, filename);

    // 3. Call Gemini
    let geminiResponse: any;
    try {
      geminiResponse = await analyzeWithGemini(profile, prompt);
    } catch (err: any) {
      console.error("Gemini API error:", err);
      
      // Show user-friendly error messages instead of raw API errors
      const errMsg = err?.message || "";
      let userMessage = "Failed to analyze data with AI. Please try again.";
      
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("Too Many Requests")) {
        userMessage = "⏳ API rate limit reached. Your free tier quota is exhausted. Please wait a few minutes and try again, or enable billing on your Google AI project for higher limits.";
      } else if (errMsg.includes("503") || errMsg.includes("Service Unavailable")) {
        userMessage = "⏳ Gemini AI is currently experiencing high demand. Please try again in a moment.";
      } else if (errMsg.includes("401") || errMsg.includes("403") || errMsg.includes("API key")) {
        userMessage = "🔑 Invalid API key. Please check your GEMINI_API_KEY in .env.local";
      } else if (errMsg.includes("not configured")) {
        userMessage = "🔑 " + errMsg;
      }
      
      return NextResponse.json(
        { error: userMessage },
        { status: 500 }
      );
    }

    // 4. Build the response
    const mode = geminiResponse.mode || "chart";

    if (mode === "dashboard") {
      // Cap raw data at 10,000 rows for browser performance
      const rawData = rows.slice(0, 10000);
      const dashboardId = uuidv4();

      return NextResponse.json({
        mode: "dashboard",
        dashboardId,
        title: geminiResponse.title || "Data Dashboard",
        description: geminiResponse.description || "",
        insight: geminiResponse.insight || "",
        kpis: geminiResponse.kpis || [],
        filters: geminiResponse.filters || [],
        charts: (geminiResponse.charts || []).map((chart: any) => ({
          title: chart.title || "Chart",
          type: chart.type || "bar",
          description: chart.description || "",
          plotlyData: chart.plotlyData || chart.data || [],
          plotlyLayout: chart.plotlyLayout || chart.layout || {},
        })),
        rawData,
      });
    }

    // Chart mode
    const chart = geminiResponse.chart || geminiResponse.charts?.[0] || {};
    return NextResponse.json({
      mode: "chart",
      title: geminiResponse.title || "Analysis Result",
      description: geminiResponse.description || "",
      insight: geminiResponse.insight || "",
      chart: {
        title: chart.title || "Chart",
        type: chart.type || "bar",
        description: chart.description || "",
        plotlyData: chart.plotlyData || chart.data || [],
        plotlyLayout: chart.plotlyLayout || chart.layout || {},
      },
    });
  } catch (err: any) {
    console.error("Analysis API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
