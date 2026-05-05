"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useTranslations } from "next-intl";
import { useMe, useLogout } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user } = useMe();
  const { logout } = useLogout();

  const navLinks = [
    { label: t("Nav.courses"), href: "#courses" },
    { label: t("Nav.roadmap"), href: "#roadmap" },
    { label: t("Nav.instructors"), href: "#instructors" },
    { label: t("Nav.blog"), href: "#blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-amber">
            <BookOpen className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-sora text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            NexLearn
          </span>
        </Link>

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-brand-bg2 hover:bg-brand-bg3 p-0 overflow-hidden border border-brand-border cursor-pointer">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 border-brand-border bg-brand-bg/95 backdrop-blur-md" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs leading-none text-slate-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-brand-border" />
                <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer" >
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-brand-border" />
                <DropdownMenuItem className="focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:bg-transparent hover:text-brand-amber dark:text-slate-400"
              >
                <Link href="/auth/login">{t("Common.login")}</Link>
              </Button>
              <Button
                size="sm"
                className="bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
              >
                <Link href="/auth/signup">{t("Common.start_free")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center justify-center text-slate-600 dark:text-slate-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("Header.toggle_menu")}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-brand-border bg-brand-bg2 px-4 pb-4 md:hidden">
          {user && (
            <div className="border-b border-brand-border py-4 mb-2">
              <div className="flex items-center gap-3 px-3">
                <div className="h-10 w-10 rounded-full bg-brand-bg3 overflow-hidden border border-brand-border">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-bg3">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

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

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
              </>
            )}
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Button
                variant="outline"
                className="w-full border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:text-brand-amber dark:text-slate-400"
                >
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>{t("Common.login")}</Link>
                </Button>
                <Button
                  className="w-full bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
                >
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>{t("Common.start_free")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
