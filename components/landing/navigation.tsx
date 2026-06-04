"use client";

import React from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-foreground/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            DataVision
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-foreground/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-foreground/10 mx-2" />
          <Link
            href="/chat"
            className="ml-1 px-5 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-200 hover:shadow-lg hover:shadow-foreground/5"
          >
            Open App
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-foreground/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 bg-background/95 backdrop-blur-xl border-b border-foreground/5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
