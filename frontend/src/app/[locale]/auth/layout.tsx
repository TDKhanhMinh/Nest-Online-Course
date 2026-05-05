"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Auth.layout");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-bg flex flex-col items-center justify-center p-4">
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-amber/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-brand-amber/5 blur-[120px]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link href="/" className="flex items-center gap-2 no-underline group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber transition-transform group-hover:scale-110">
            <BookOpen className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-sora text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            NexLearn
          </span>
        </Link>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md z-10"
      >
        {children}
      </motion.div>

      {/* Footer decoration */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NexLearn. {t("motto")}
        </p>
      </div>
    </div>
  );
}
