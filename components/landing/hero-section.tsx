"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";

const words = ["chat", "visualize", "explore", "discover"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
        <AnimatedSphere />
      </div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Eyebrow */}
        <div 
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            AI-powered data visualization
          </span>
        </div>
        
        {/* Main headline */}
        <div className="mb-8 lg:mb-12 max-w-4xl">
          <h1 
            className={`text-5xl lg:text-7xl font-display leading-tight tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block text-lg lg:text-2xl mb-2">Stop building dashboards.</span>
            <span className="block">
              Start{" "}
              <span className="relative inline-block">
                <span 
                  key={wordIndex}
                  className="inline-flex"
                >
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description and CTAs */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          <p 
            className={`text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl flex-shrink-0 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            The AI-powered architect that turns your raw data into stunning visualizations in seconds. Just type, chat, and see.
          </p>
          
          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300 flex-shrink-0 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button 
              size="lg" 
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-12 text-sm rounded-full group whitespace-nowrap"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-sm rounded-full border-foreground/20 hover:bg-foreground/5 whitespace-nowrap"
            >
              Watch demo
            </Button>
          </div>
        </div>
        
      </div>
      
      {/* Stats marquee - full width outside container */}
      <div 
        className={`relative mt-16 lg:mt-20 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-12 lg:gap-16 marquee whitespace-nowrap px-6 lg:px-12 overflow-x-auto pb-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 lg:gap-16">
              {[
                { value: "1ms", label: "query response", company: "ENTERPRISE" },
                { value: "99.9%", label: "uptime guarantee", company: "ANALYTICS" },
                { value: "256-bit", label: "encryption", company: "SECURITY" },
                { value: "100+", label: "data sources", company: "INTEGRATION" },
              ].map((stat) => (
                <div key={`${stat.company}-${i}`} className="flex items-baseline gap-3 flex-shrink-0">
                  <span className="text-2xl lg:text-3xl font-display">{stat.value}</span>
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    {stat.label}
                    <span className="block font-mono text-xs mt-0.5">{stat.company}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      
    </section>
  );
}
