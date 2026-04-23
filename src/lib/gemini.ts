// ============================================================
// Gemini 2.0 Flash client — sends data profiles and receives
// Plotly JSON specs for visualization
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DataProfile } from "./data-profiler";
import { formatProfileForPrompt } from "./data-profiler";

const BLUE_PALETTE = [
  "#3B82F6", "#2563EB", "#1D4ED8", "#60A5FA",
  "#93C5FD", "#BFDBFE", "#1E40AF", "#3730A3",
];

const SYSTEM_PROMPT = `You are an expert data analyst and visualization specialist.
You receive a dataset profile (column names, data types, null counts, statistics, sample rows) and a user request.

Your job is to:
1. CLASSIFY the request as either "chart" (user wants ONE specific chart) or "dashboard" (user wants full analysis / multiple charts / dashboard).

   Examples of "chart" requests: "bar chart of X", "show me a pie chart", "plot Y over time", "scatter of A vs B"
   Examples of "dashboard" requests: "analyze this data", "create a dashboard", "give me insights", "full breakdown", "overview of this data"

2. Based on the mode, return a JSON response.

IMPORTANT RULES for Plotly specs:
- Return Plotly.js-compatible JSON (NOT Python code)
- Use this blue color palette: ${JSON.stringify(BLUE_PALETTE)}
- For the layout, use: white background, clean fonts (Arial/Inter), no gridlines on the background
- Make charts clean, professional, and modern
- For bar charts, use rounded corners if possible
- Always include hover info
- Set reasonable margins: { t: 40, r: 20, b: 60, l: 60 }
- Do NOT include a title in the layout (we render it separately)

FOR "chart" MODE, return:
{
  "mode": "chart",
  "title": "Dashboard title",
  "description": "Brief description of what was analyzed",
  "insight": "2-3 sentence key insight from the data",
  "chart": {
    "title": "Chart Title",
    "type": "bar|line|pie|scatter|histogram|heatmap|treemap",
    "description": "What this chart shows",
    "plotlyData": [ { Plotly trace object } ],
    "plotlyLayout": { Plotly layout object }
  }
}

FOR "dashboard" MODE, return:
{
  "mode": "dashboard",
  "title": "Dashboard Title",
  "description": "Description of the dashboard",
  "insight": "Key findings summary",
  "kpis": [
    { "label": "Metric Name", "value": "1234.56", "prefix": "$", "suffix": "USD" }
  ],
  "filters": [
    { "column": "ColumnName", "type": "select", "options": ["val1", "val2"] }
  ],
  "charts": [
    {
      "title": "Chart Title",
      "type": "bar|line|pie|scatter|histogram|heatmap",
      "description": "What this shows",
      "plotlyData": [ { Plotly trace object } ],
      "plotlyLayout": { Plotly layout object }
    }
  ]
}

For dashboards, generate 4-6 charts and 3-5 KPIs that best represent the data.
For filters, suggest 2-4 categorical or date columns that make sense for filtering.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations outside the JSON.
Calculate actual values from the sample data and data profile stats provided.`;

// Models to try, in priority order
const MODELS = ["gemini-2.0-flash"];

/**
 * Call Gemini with the data profile and user prompt.
 * Uses gemini-2.0-flash — fast, reliable, no thinking overhead.
 * Accepts an optional clientApiKey as fallback when GEMINI_API_KEY env var is not set.
 */
export async function analyzeWithGemini(
  profile: DataProfile,
  userPrompt: string,
  clientApiKey?: string
): Promise<any> {
  const apiKey = (process.env.GEMINI_API_KEY?.trim()) || clientApiKey?.trim();
  if (!apiKey) {
    throw new Error(
      "No Gemini API key configured. Please add your key using the key icon in the sidebar."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const profileText = formatProfileForPrompt(profile);

  const prompt = `${SYSTEM_PROMPT}

--- DATA PROFILE ---
${profileText}

--- USER REQUEST ---
"${userPrompt}"

Please analyze the data profile and respond with the appropriate JSON structure.`;

  console.log(`[Gemini] Sending profile for "${profile.filename}" (${profile.rows} rows, ${profile.columns} cols), prompt length: ${prompt.length} chars`);

  let lastError: Error | null = null;

  for (const modelName of MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    });

    // Up to 3 retry attempts per model for transient errors
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) {
          // Exponential backoff: 2s, 4s
          await new Promise((r) => setTimeout(r, attempt * 2000));
        }

        console.log(`[Gemini] Trying ${modelName} (attempt ${attempt + 1})...`);

        // Wrap in a 60-second timeout so we never hang indefinitely
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini request timed out after 60s")), 60_000)
          ),
        ]);

        const text = (result as Awaited<ReturnType<typeof model.generateContent>>).response.text();
        console.log(`[Gemini] Success with ${modelName}`);

        return parseGeminiResponse(text);
      } catch (err: any) {
        lastError = err;
        const is503 = err?.message?.includes("503") || err?.message?.includes("Service Unavailable");
        const is429 = err?.message?.includes("429") || err?.message?.includes("Resource has been exhausted");
        const isTimeout = err?.message?.includes("timed out");

        if (is503 || is429 || isTimeout) {
          console.warn(`[Gemini] ${modelName} issue on attempt ${attempt + 1}: ${err.message}. ${attempt < 2 ? "Retrying..." : "Giving up."}`);
          continue;
        }

        // For other errors (auth, bad request, etc.), throw immediately
        throw err;
      }
    }
  }

  throw lastError || new Error("All Gemini models failed. Please try again later.");
}

/**
 * Parse Gemini's text response into a JSON object.
 */
function parseGeminiResponse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try finding JSON object
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
