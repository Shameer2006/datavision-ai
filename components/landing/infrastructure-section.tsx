"use client";

import { useEffect, useState, useRef } from "react";

const features = [
  { name: "Query Engine", capability: "LLM-powered", speed: "<100ms" },
  { name: "Schema Detection", capability: "Automatic mapping", speed: "Instant" },
  { name: "Chart Generation", capability: "AI-optimized", speed: "<500ms" },
  { name: "Data Sandbox", capability: "Secure isolation", speed: "Live" },
  { name: "Export API", capability: "Multi-format", speed: "Real-time" },
  { name: "Caching Layer", capability: "Smart cache", speed: "Microseconds" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Architecture
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Built for speed
              <br />
              and intelligence.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Lightning-fast AI inference, intelligent schema detection, and secure data processing. 
              Our proprietary query engine understands context to generate the perfect visualization instantly.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">100ms</div>
                <div className="text-sm text-muted-foreground">Avg response</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">256-bit</div>
                <div className="text-sm text-muted-foreground">Encryption</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Data sources</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Core Systems</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Optimized
                </span>
              </div>

              {/* Features */}
              <div>
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeLocation === index ? "bg-foreground/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeLocation === index ? "bg-foreground" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-muted-foreground">{feature.capability}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{feature.speed}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
