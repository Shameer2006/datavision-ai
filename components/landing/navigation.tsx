"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/blog/api-integration", label: "API Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/security", label: "Security" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
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
          <div className="relative h-8 w-8 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/icon.png"
              alt="DataVision AI Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            DataVision
          </span>
        </Link>

        {/* Desktop Links (Centered) */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-foreground/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons (Right) */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {user ? (
            <>
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Log Out
              </button>
              <Link
                href="/chat"
                className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5"
              >
                Open App →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5"
              >
                Get Started →
              </Link>
            </>
          )}
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
            {user ? (
              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
              >
                Open App
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
