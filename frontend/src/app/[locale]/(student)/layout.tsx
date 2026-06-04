"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Award, ChevronRight, GraduationCap, LayoutDashboard, Receipt, UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("UserMenu");

  // Check if it's a full-width page like cart, checkout, or learning player
  const isFullWidthPage = /\/(cart|checkout|learning)(\/|$)/.test(pathname || "");

  if (isFullWidthPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("my_courses"),
      href: "/my-courses",
      icon: GraduationCap,
    },
    {
      title: t("certificates"),
      href: "/certificates",
      icon: Award,
    },
    {
      title: t("profile"),
      href: "/profile",
      icon: UserCircle,
    },
    {
      title: t("orders"),
      href: "/orders",
      icon: Receipt,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar (lg and up) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="flex flex-col gap-1 rounded-2xl border border-brand-border bg-brand-bg2 p-4 backdrop-blur-sm sticky top-24">
            <div className="px-3 py-2 mb-2 border-b border-brand-border/50 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("learning_label")}
              </span>
            </div>
            {navItems.map((item) => {
              const isActive = pathname.endsWith(item.href) || pathname.includes(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 no-underline cursor-pointer group",
                    isActive
                      ? "bg-brand-amber text-black hover:bg-brand-amber2 shadow-md shadow-brand-amber/10"
                      : "text-slate-600 hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-black" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white")} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-black animate-in fade-in slide-in-from-left-2 duration-300" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile & Tablet Navigation (scrollable tab bar at top) */}
        <div className="lg:hidden w-full overflow-x-auto scrollbar-none border-b border-brand-border pb-3 mb-6">
          <nav className="flex gap-2 min-w-max px-1">
            {navItems.map((item) => {
              const isActive = pathname.endsWith(item.href) || pathname.includes(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all no-underline whitespace-nowrap cursor-pointer",
                    isActive
                      ? "bg-brand-amber text-black shadow-md"
                      : "text-slate-600 hover:bg-brand-bg3 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-brand-border bg-brand-bg2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
