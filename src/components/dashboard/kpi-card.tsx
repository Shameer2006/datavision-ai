"use client";

// ============================================================
// KPI Card — displays a single metric with optional
// prefix/suffix and blue accent styling
// ============================================================

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

export function KPICard({ label, value, prefix, suffix }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    animated.current = true;

    // Try to animate numbers
    const num = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(num)) {
      const duration = 800;
      const steps = 30;
      const stepDuration = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current++;
        const progress = current / steps;
        // Ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = num * eased;

        if (Number.isInteger(num)) {
          setDisplayValue(Math.round(currentValue).toLocaleString());
        } else {
          setDisplayValue(
            currentValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
        }

        if (current >= steps) {
          clearInterval(timer);
          setDisplayValue(
            Number.isInteger(num) 
              ? num.toLocaleString()
              : num.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
          );
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-4 flex flex-col gap-1 hover:border-blue-200 transition-colors group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
        </div>
      </div>
      <div className="flex items-baseline gap-0.5 mt-1">
        {prefix && (
          <span className="text-sm font-medium text-muted-foreground">
            {prefix}
          </span>
        )}
        <span className="text-2xl font-semibold text-foreground tracking-tight">
          {displayValue}
        </span>
        {suffix && (
          <span className="text-xs font-medium text-muted-foreground ml-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
