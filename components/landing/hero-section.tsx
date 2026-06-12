"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Upload, BarChart3, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-500/8 blur-[140px] animate-blob-float" />
        <div
          className="absolute -bottom-[30%] -right-[15%] w-[70%] h-[70%] rounded-full bg-violet-500/8 blur-[140px] animate-blob-float"
          style={{ animationDelay: "-8s", animationDuration: "22s" }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/6 blur-[120px] animate-blob-float"
          style={{ animationDelay: "-4s", animationDuration: "18s" }}
        />
      </div>

      {/* Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] dark:[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)] pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-sm text-sm text-muted-foreground mb-8">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>AI-Powered Data Analytics Platform</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up animation-delay-200 text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
          Transform data into{" "}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
            visual insights
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up animation-delay-300 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload your datasets, ask questions in plain English, and get instant
          interactive visualizations — no coding required.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chat"
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 hover:-translate-y-0.5"
          >
            Start Analyzing
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-foreground rounded-full border border-foreground/15 hover:bg-foreground/5 transition-all duration-300"
          >
            Learn About DataVision AI
          </Link>
        </div>

        {/* Floating Feature Chips */}
        <div
          className="animate-fade-in-up animation-delay-500 flex flex-wrap items-center justify-center gap-3 mt-16 text-sm text-muted-foreground"
          aria-label="Key features"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>CSV & Excel Support</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5">
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Interactive Charts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Natural Language AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
