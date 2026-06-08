import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "DataVision AI",
    description:
      "AI-powered data analytics platform. Upload CSV or Excel files and get instant interactive charts using plain English — no coding required.",
    version: "1.0.0",
    contact: { email: "hello@datavision.ai" },
  },
  servers: [{ url: "https://datavision-ai.vercel.app" }],
  paths: {
    "/": {
      get: {
        summary: "DataVision AI Homepage",
        description:
          "Landing page for DataVision AI — AI-powered data analytics and visualization platform.",
        operationId: "getHomepage",
        responses: { "200": { description: "HTML page" } },
      },
    },
    "/chat": {
      get: {
        summary: "Open DataVision AI Chat App",
        description:
          "The main application where users upload datasets and ask questions in natural language to generate interactive charts.",
        operationId: "getChat",
        responses: { "200": { description: "HTML page" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
