"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring DataVision AI.",
    features: [
      "1,000 Analysis Credits",
      "Basic charts & graphs",
      "CSV & Excel support",
      "Community support",
    ],
    cta: "Start for free",
    href: "/login",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For professionals who need deeper insights.",
    features: [
      "10,000 Analysis Credits",
      "Advanced interactive visualizations",
      "Export to PDF / PNG",
      "Priority email support",
      "Early access to new features",
    ],
    cta: "Get Pro",
    href: "/login",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large teams.",
    features: [
      "Unlimited Analysis Credits",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment options",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold leading-7 text-primary uppercase tracking-wider">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that best fits your data analytics needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-3xl p-8 xl:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                tier.popular
                  ? "bg-foreground text-background ring-1 ring-foreground shadow-xl scale-105 z-10"
                  : "bg-card text-foreground ring-1 ring-border shadow-lg"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-chart-2 px-3 py-1 text-center text-sm font-medium text-primary-foreground shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-xl font-semibold leading-8 ${tier.popular ? 'text-background' : 'text-foreground'}`}>
                    {tier.name}
                  </h3>
                </div>
                <p className={`mt-4 text-sm leading-6 ${tier.popular ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className={`text-4xl font-bold tracking-tight ${tier.popular ? 'text-background' : 'text-foreground'}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm font-semibold leading-6 ${tier.popular ? 'text-background/80' : 'text-muted-foreground'}`}>
                      {tier.period}
                    </span>
                  )}
                </p>
                <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 xl:mt-10 ${tier.popular ? 'text-background/90' : 'text-muted-foreground'}`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className={`h-6 w-5 flex-none ${tier.popular ? 'text-primary-foreground' : 'text-primary'}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href={tier.href}
                className={`mt-8 block rounded-full px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ${
                  tier.popular
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
