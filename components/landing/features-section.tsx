import React from "react";
import {
  Upload,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Drag & Drop Upload",
    description:
      "Simply drag your CSV, Excel, or XLS files into the chat and your data is instantly parsed and ready for analysis.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Queries",
    description:
      "Ask questions about your data in plain English. No SQL, no formulas — just conversation.",
  },
  {
    icon: BarChart3,
    title: "Interactive Visualizations",
    description:
      "Get stunning Plotly charts that you can zoom, pan, and hover over. Every visualization is fully interactive.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "AI analyzes trends, correlations, and anomalies across your dataset in seconds, surfacing what matters most.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data stays in your browser. We use metadata-only processing — your raw data never leaves your machine.",
  },
  {
    icon: Layers,
    title: "Multi-Conversation",
    description:
      "Manage multiple analyses simultaneously. Each dataset gets its own conversation thread with full history.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-36">
      {/* Subtle divider gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Features
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              understand your data
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From upload to insight in under 30 seconds. DataVision AI handles
            the complexity so you can focus on decisions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-8 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-500 hover:border-foreground/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/[0.03]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-foreground mb-6 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
