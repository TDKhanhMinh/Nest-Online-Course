"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  ShieldCheck,
  Award,
  ChevronDown,
  MessageCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  getting_started: <Zap className="h-5 w-5" />,
  courses: <BookOpen className="h-5 w-5" />,
  payments: <CreditCard className="h-5 w-5" />,
  account: <Settings className="h-5 w-5" />,
  certificates: <Award className="h-5 w-5" />,
  community: <Users className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  getting_started: "from-amber-500 to-orange-500",
  courses: "from-blue-500 to-indigo-500",
  payments: "from-emerald-500 to-teal-500",
  account: "from-violet-500 to-purple-500",
  certificates: "from-rose-500 to-pink-500",
  community: "from-cyan-500 to-sky-500",
};

const FAQ_CATEGORIES = [
  "getting_started",
  "courses",
  "payments",
  "account",
  "certificates",
  "community",
] as const;

// Each category has 3 questions
const FAQ_ITEMS_PER_CATEGORY = 3;

export function HelpCenterView() {
  const t = useTranslations("HelpCenter");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Build FAQ data from translations
  const faqData = useMemo(() => {
    return FAQ_CATEGORIES.map((cat) => ({
      id: cat,
      title: t(`categories.${cat}.title`),
      icon: CATEGORY_ICONS[cat],
      color: CATEGORY_COLORS[cat],
      items: Array.from({ length: FAQ_ITEMS_PER_CATEGORY }, (_, i) => ({
        id: `${cat}-${i}`,
        question: t(`categories.${cat}.q${i + 1}`),
        answer: t(`categories.${cat}.a${i + 1}`),
      })),
    }));
  }, [t]);

  // Filtered FAQs by search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const q = searchQuery.toLowerCase();
    return faqData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [faqData, searchQuery]);

  const displayData = activeCategory
    ? filteredData.filter((c) => c.id === activeCategory)
    : filteredData;

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-bg2 to-brand-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-brand-border">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-amber/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-amber/10 text-brand-amber text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              {t("hero_badge")}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {t("hero_title")}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              {t("hero_subtitle")}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder={t("search_placeholder")}
                className="pl-12 h-12 sm:h-14 text-sm sm:text-base border-brand-border bg-white dark:bg-brand-card shadow-lg shadow-black/5 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Category Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 sm:mb-14"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-5 sm:mb-6">
            {t("browse_topics")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {faqData.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                className={`
                  group relative flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-xl border transition-all duration-200
                  min-h-[100px] sm:min-h-[120px]
                  ${
                    activeCategory === cat.id
                      ? "border-brand-amber bg-brand-amber/5 ring-1 ring-brand-amber/30 shadow-md"
                      : "border-brand-border bg-white dark:bg-brand-card hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  }
                `}
              >
                <div
                  className={`
                  h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center text-white
                  bg-gradient-to-br ${cat.color}
                  group-hover:scale-105 transition-transform motion-safe:duration-200
                `}
                >
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                  {cat.title}
                </span>
              </button>
            ))}
          </div>

          {activeCategory && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-slate-500 hover:text-brand-amber"
                onClick={() => setActiveCategory(null)}
              >
                {t("show_all")}
              </Button>
            </div>
          )}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-5 sm:mb-6">
            {t("faq_title")}
          </h2>

          {displayData.length === 0 && (
            <Card className="p-8 sm:p-12 text-center border-brand-border bg-white dark:bg-brand-card">
              <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                {t("no_results")}
              </p>
            </Card>
          )}

          <div className="space-y-6 sm:space-y-8">
            {displayData.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  <div
                    className={`h-7 w-7 rounded-md flex items-center justify-center text-white bg-gradient-to-br ${cat.color}`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-400"
                  >
                    {cat.items.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => {
                    const isOpen = openItem === item.id;
                    return (
                      <div
                        key={item.id}
                        className="border border-brand-border rounded-xl bg-white dark:bg-brand-card overflow-hidden transition-shadow hover:shadow-sm"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left min-h-[52px]"
                        >
                          <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 pr-4">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                                <div className="border-t border-brand-border/50 pt-3 sm:pt-4">
                                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                    {item.answer}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA - Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 sm:mt-16"
        >
          <Card className="relative overflow-hidden border-brand-border bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 lg:p-10 rounded-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand-amber/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-brand-amber" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                    {t("cta_title")}
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md">
                    {t("cta_subtitle")}
                  </p>
                </div>
              </div>
              <Link href="/support">
                <Button className="bg-brand-amber text-black hover:bg-brand-amber/90 font-semibold h-11 px-6 rounded-xl group w-full lg:w-auto min-h-[44px] min-w-[44px]">
                  {t("cta_button")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Hero stacks vertically, search full-width. Category grid 2-col. FAQ items full-width.
// tablet  (md):            Category grid 3-col. Larger padding and spacing. CTA side-by-side.
// desktop (lg / xl / 2xl): Category grid 6-col. FAQ answers wider. CTA horizontal layout.
// Interaction:             Search filtering, category toggle, accordion open/close with framer-motion.
