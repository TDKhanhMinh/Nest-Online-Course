"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/features/auth/infrastructure/auth.api";
import { useLogout, useMe } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { Link } from "@/i18n/navigation";
import { Award, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, Receipt, Settings, ShoppingBag, User, UserCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user } = useMe();
  const { logout } = useLogout();

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.roles?.includes(Role.ADMIN)) return "/admin";
    if (user.roles?.includes(Role.INSTRUCTOR)) return "/instructor/dashboard";
    return "/dashboard";
  };

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
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/cart" className="relative group p-2 rounded-lg hover:bg-brand-bg2 transition-colors no-underline">
            <ShoppingBag className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-brand-amber transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-amber text-[10px] font-black text-black shadow-lg border border-brand-bg ring-2 ring-brand-bg">
              2
            </span>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-brand-bg2 hover:bg-brand-bg3 p-0 overflow-hidden border border-brand-border cursor-pointer">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 mt-2 border-brand-border bg-brand-bg/95 backdrop-blur-md" align="end">
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-amber/15 text-brand-amber">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold">{user.fullName?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-0.5 min-w-0">
                      <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white truncate">{user.fullName}</p>
                      <p className="text-xs leading-none text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-brand-border" />

                {/* Learning section */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
                    {t("UserMenu.learning_label")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href="/my-courses" className="flex items-center w-full no-underline text-inherit">
                      <GraduationCap className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.my_courses")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href="/certificates" className="flex items-center w-full no-underline text-inherit">
                      <Award className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.certificates")}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-brand-border" />

                {/* Account section */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5">
                    {t("UserMenu.account_label")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href="/profile" className="flex items-center w-full no-underline text-inherit">
                      <UserCircle className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href="/orders" className="flex items-center w-full no-underline text-inherit">
                      <Receipt className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.orders")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href={getDashboardLink()} className="flex items-center w-full no-underline text-inherit">
                      <LayoutDashboard className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-brand-bg2 cursor-pointer px-3 py-2">
                    <Link href="/settings" className="flex items-center w-full no-underline text-inherit">
                      <Settings className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>{t("UserMenu.settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-brand-border" />

                {/* Logout */}
                <DropdownMenuItem
                  className="focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer px-3 py-2"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span>{t("UserMenu.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex text-slate-600 hover:text-brand-amber dark:text-slate-400"
              >
                <Link href="/auth/instructor-login">
                  {t("Common.instructor_login")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:bg-transparent hover:text-brand-amber dark:text-slate-400"
              >
                <Link href="/auth/login">{t("Common.login")}</Link>
              </Button>
              <Button
                asChild
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
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-brand-bg3 transition-colors no-underline">
            <ShoppingBag className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-amber text-[8px] font-black text-black">
              2
            </span>
          </Link>
          <LanguageSwitcher />
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
                {/* Learning links */}
                <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                  {t("UserMenu.learning_label")}
                </p>
                <Link
                  href="/my-courses"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <GraduationCap className="mr-3 h-4 w-4" />
                  {t("UserMenu.my_courses")}
                </Link>
                <Link
                  href="/certificates"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <Award className="mr-3 h-4 w-4" />
                  {t("UserMenu.certificates")}
                </Link>

                {/* Account links */}
                <p className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                  {t("UserMenu.account_label")}
                </p>
                <Link
                  href="/profile"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle className="mr-3 h-4 w-4" />
                  {t("UserMenu.profile")}
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <Receipt className="mr-3 h-4 w-4" />
                  {t("UserMenu.orders")}
                </Link>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="mr-3 h-4 w-4" />
                  {t("UserMenu.dashboard")}
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  {t("UserMenu.settings")}
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
                {t("UserMenu.logout")}
              </Button>
            ) : (
              <>
                <Link
                  href="/auth/instructor-login"
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-bg3 hover:text-brand-amber dark:text-slate-400 dark:hover:text-white no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle className="mr-3 h-4 w-4" />
                  {t("Common.instructor_login")}
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-brand-border bg-transparent text-slate-600 hover:border-brand-amber hover:text-brand-amber dark:text-slate-400"
                >
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                    {t("Common.login")}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
                >
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                    {t("Common.start_free")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
