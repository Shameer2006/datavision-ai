"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features", sectionId: "features" },
  { name: "How it works", href: "#how-it-works", sectionId: "how-it-works" },
  { name: "Developers", href: "#developers", sectionId: "developers" },
  { name: "Pricing", href: "#pricing", sectionId: "pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = navLinks.map((l) => document.getElementById(l.sectionId));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(navLinks[i].sectionId);
            return;
          }
        }
      }
      setActiveSection(null);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = useCallback((sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only smooth-scroll if we're on the home page
    if (pathname !== "/") return; // Let browser handle navigation
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    setIsMobileMenuOpen(false);
    // Update URL hash without triggering page jump
    history.pushState(null, "", `#${sectionId}`);
  }, [pathname]);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${isScrolled
          ? "top-4 left-4 right-4"
          : "top-0 left-0 right-0"
        }`}
      style={{ willChange: "transform" }}
    >
      <nav 
        role="navigation"
        aria-label="Main navigation"
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
          }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${isScrolled ? "h-14" : "h-20"
            }`}
        >
          {/* Logo */}
          <a href="/" aria-label="DataVision AI - Home" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="DataVision AI Logo" className={`transition-all duration-500 ${isScrolled ? "h-8" : "h-10"} object-contain`} />
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>DataVision AI</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12" role="menubar">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={(e) => smoothScrollTo(link.sectionId, e)}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
                aria-current={activeSection === link.sectionId ? "true" : undefined}
                role="menuitem"
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  activeSection === link.sectionId ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className={`text-foreground/70 hover:text-foreground transition-all duration-500 ${isScrolled ? "text-xs" : "text-sm"}`}>
              Sign in
            </a>
            <Button
              size="sm"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              Start creating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
          }`}
        style={{ top: 0 }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={(e) => smoothScrollTo(link.sectionId, e)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              variant="outline"
              className="flex-1 rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Button>
            <Button
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start creating
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
