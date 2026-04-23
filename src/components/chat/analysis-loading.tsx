"use client";

// ============================================================
// Analysis Loading — animated loading state shown while
// Gemini is analyzing the data
// ============================================================

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Reading data", icon: "📄" },
  { label: "Analyzing columns", icon: "🔍" },
  { label: "Generating visualizations", icon: "📊" },
  { label: "Building results", icon: "✨" },
];

export function AnalysisLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md my-3">
      <div className="border border-foreground/10 rounded-2xl overflow-hidden bg-background/80 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Analyzing your data...
          </span>
        </div>

        <div className="space-y-2.5">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 transition-all duration-500 ${
                i <= activeStep
                  ? "opacity-100"
                  : "opacity-30"
              }`}
            >
              <span className="text-sm">{step.icon}</span>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  i < activeStep
                    ? "text-muted-foreground line-through"
                    : i === activeStep
                    ? "text-blue-600"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
                {i === activeStep && (
                  <span className="inline-flex ml-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                  </span>
                )}
              </span>
              {i < activeStep && (
                <span className="text-green-500 text-xs ml-auto">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Skeleton preview */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-foreground/5 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <div className="mt-2 h-24 rounded-xl bg-foreground/5 animate-pulse" />
      </div>
    </div>
  );
}
