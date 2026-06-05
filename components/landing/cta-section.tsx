import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-36">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-foreground/5 bg-foreground/[0.02] px-8 py-16 sm:px-16 sm:py-24 text-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-500/10 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Ready to see your data
              <br />
              in a new light?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of analysts, researchers, and teams who use
              DataVision AI to make smarter decisions, faster.
            </p>
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2.5 px-10 py-4 text-base font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/10 hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
