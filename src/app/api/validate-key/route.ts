import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 15;

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ valid: false, error: "No API key provided." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Minimal test request
    await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "hi" }] }],
      generationConfig: { maxOutputTokens: 5 },
    });

    return NextResponse.json({ valid: true });
  } catch (err: any) {
    const msg = err?.message || "";
    let error = "Invalid API key. Please check and try again.";

    if (msg.includes("API_KEY_INVALID") || msg.includes("401") || msg.includes("403")) {
      error = "Invalid API key. Please check it and try again.";
    } else if (msg.includes("429") || msg.includes("quota")) {
      // Key exists but quota exceeded — still treat as valid
      return NextResponse.json({ valid: true });
    } else if (msg.includes("503")) {
      error = "Gemini service is temporarily unavailable. Try again in a moment.";
    }

    return NextResponse.json({ valid: false, error }, { status: 400 });
  }
}
