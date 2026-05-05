"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { label: "Khóa học", href: "#courses" },
  { label: "Lộ trình", href: "#roadmap" },
  { label: "Giảng viên", href: "#instructors" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-amber">
            <BookOpen className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-sora text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            NexLearn
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:bg-transparent hover:text-brand-amber dark:text-slate-400"
          >
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
          <Button
            size="sm"
            className="bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
          >
            <Link href="/auth/signup">Bắt đầu miễn phí</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center justify-center text-slate-600 dark:text-slate-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-brand-border bg-brand-bg2 px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:text-brand-amber dark:text-slate-400"
            >
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
            </Button>
            <Button
              className="w-full bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
            >
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
