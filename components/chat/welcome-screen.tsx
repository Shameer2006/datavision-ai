"use client";

import * as React from "react";
import { BarChartIcon, DatabaseIcon, CodeIcon, LineChartIcon } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: <BarChartIcon className="h-5 w-5 text-blue-500" />,
    title: "Visualize sales data",
    subtitle: "create a dashboard for Q3",
  },
  {
    icon: <DatabaseIcon className="h-5 w-5 text-green-500" />,
    title: "Connect database",
    subtitle: "import from PostgreSQL",
  },
  {
    icon: <LineChartIcon className="h-5 w-5 text-purple-500" />,
    title: "Trend analysis",
    subtitle: "predict next month's MRR",
  },
  {
    icon: <CodeIcon className="h-5 w-5 text-orange-500" />,
    title: "Generate script",
    subtitle: "Python data cleanup code",
  },
];

interface WelcomeScreenProps {
  onSuggest: (text: string) => void;
}

export function WelcomeScreen({ onSuggest }: WelcomeScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="mb-12 flex flex-col items-center gap-4 text-center fade-in-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
          DV
        </div>
        <h1 className="text-3xl font-semibold md:text-4xl">How can I help you today?</h1>
        <p className="text-muted-foreground max-w-md">
          I can analyze data, create visualizations, or help you connect to your databases.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
        {SUGGESTIONS.map((suggestion, idx) => (
          <div
            key={idx}
            className="group flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left transition-all hover:bg-accent hover:shadow-md fade-in-up"
            style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
          >
            {suggestion.icon}
            <div>
              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                {suggestion.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {suggestion.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
