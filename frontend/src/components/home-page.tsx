"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search, Star, Clock, BookOpen, Users, Award, Smartphone,
  MessageSquare, TrendingUp, ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  tag, title, subtitle,
}: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-9">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-brand-amber">{tag}</p>
      <h2 className="font-sora text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  const t = useTranslations("HomePage.featured");
  return (
    <Card className="group overflow-hidden border border-brand-border bg-brand-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:shadow-2xl hover:shadow-black/50">
      {/* Thumbnail */}
      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${course.gradient}`}>
        <span className="text-5xl">{course.emoji}</span>
        <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${course.badgeColor}`}>
          {course.badge}
        </span>
      </div>

      <CardContent className="p-4">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-amber">
          {course.category}
        </p>
        <h3 className="mb-1.5 font-sora text-[15px] font-bold leading-snug text-slate-900 dark:text-white">
          {course.title}
        </h3>
        <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">{course.author}</p>

        {/* Meta */}
        <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t("duration", { count: course.durationVal })}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{t("lessons", { count: course.lessonsVal })}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t("students", { count: course.studentsVal })}</span>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3" fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white">{course.rating}</span>
          <span className="text-xs text-slate-500">({course.reviews.toLocaleString()})</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-brand-border pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sora text-lg font-extrabold text-brand-amber">{course.price}</span>
            <span className="text-xs text-slate-500 line-through">{course.originalPrice}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-brand-amber/50 bg-transparent px-3 text-xs font-semibold text-brand-amber hover:bg-brand-amber hover:text-black"
          >
            {t("register")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page Body ───────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations("HomePage");
  const tc = useTranslations("Common");

  const stats = [
    { value: t("stats.courses_val"), label: t("stats.courses") },
    { value: t("stats.instructors_val"), label: t("stats.instructors") },
    { value: t("stats.students_val"), label: t("stats.students") },
    { value: t("stats.rating_val"), label: t("stats.rating") },
  ];

  const trustLogos = ["FPT Software", "VNG Corp", "Tiki", "Momo", "Got It", "KMS Tech"];

  const categories = [
    { icon: "💻", name: t("categories.programming"), count: 284 },
    { icon: "🎨", name: t("categories.design"),      count: 156 },
    { icon: "📊", name: t("categories.data_ai"),     count: 203 },
    { icon: "📱", name: t("categories.mobile_dev"),  count: 98  },
    { icon: "☁️", name: t("categories.cloud_devops"), count: 112 },
    { icon: "🔐", name: t("categories.security"),     count: 67  },
    { icon: "📢", name: t("categories.marketing"),    count: 145 },
    { icon: "💼", name: t("categories.business"),     count: 89  },
  ];

  const courses = [
    {
      id: "react",
      gradient: "from-blue-100 via-cyan-100 to-teal-100 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364]",
      emoji: "⚛️",
      badge: t("featured.bestseller"),
      badgeColor: "bg-brand-amber text-black",
      category: t("course_data.react.category"),
      title: t("course_data.react.title"),
      author: t("course_data.react.author"),
      durationVal: 42, lessonsVal: 186, studentsVal: "12.4k",
      rating: 4.9, reviews: 3241,
      price: "599K", originalPrice: "1,299K",
    },
    {
      id: "ai",
      gradient: "from-purple-100 via-violet-100 to-fuchsia-100 dark:from-[#1a0533] dark:via-[#2d1b69] dark:to-[#11998e]",
      emoji: "🤖",
      badge: t("featured.newest"),
      badgeColor: "bg-blue-500 text-white",
      category: t("course_data.ai.category"),
      title: t("course_data.ai.title"),
      author: t("course_data.ai.author"),
      durationVal: 28, lessonsVal: 124, studentsVal: "8.7k",
      rating: 4.8, reviews: 1876,
      price: "799K", originalPrice: "1,499K",
    },
    {
      id: "security",
      gradient: "from-rose-100 via-red-100 to-orange-100 dark:from-[#0a0a1a] dark:via-[#1a1a2e] dark:to-[#e94560]",
      emoji: "🔐",
      badge: t("featured.hot"),
      badgeColor: "bg-red-500 text-white",
      category: t("course_data.security.category"),
      title: t("course_data.security.title"),
      author: t("course_data.security.author"),
      durationVal: 36, lessonsVal: 158, studentsVal: "5.2k",
      rating: 4.7, reviews: 987,
      price: "699K", originalPrice: "1,199K",
    },
  ];

  const featuresList = [
    {
      icon: TrendingUp,
      title: t("features.path_title"),
      desc: t("features.path_desc"),
    },
    {
      icon: Award,
      title: t("features.cert_title"),
      desc: t("features.cert_desc"),
    },
    {
      icon: MessageSquare,
      title: t("features.mentor_title"),
      desc: t("features.mentor_desc"),
    },
    {
      icon: Smartphone,
      title: t("features.anywhere_title"),
      desc: t("features.anywhere_desc"),
    },
  ];

  const testimonialsList = [
    {
      quote: t("testimonials.quote1"),
      name: "Phạm Thanh Tùng",
      role: t("testimonials_data.pt.role"),
      initials: "PT",
      avatarClass: "bg-brand-amber/20 text-brand-amber",
    },
    {
      quote: t("testimonials.quote2"),
      name: "Nguyễn Hải Yến",
      role: t("testimonials_data.nh.role"),
      initials: "NH",
      avatarClass: "bg-indigo-500/20 text-indigo-400",
    },
    {
      quote: t("testimonials.quote3"),
      name: "Trần Lê Minh",
      role: t("testimonials_data.tl.role"),
      initials: "TL",
      avatarClass: "bg-emerald-500/20 text-emerald-400",
    },
  ];

  return (
    <main className="bg-brand-bg">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-amber/10 blur-[80px]" />

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-amber/30 bg-brand-amber/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-amber2" />
          <span className="text-xs font-medium text-brand-amber2">{t("hero.badge")}</span>
        </div>

        <h1 className="font-sora mx-auto mb-5 max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white lg:text-6xl">
          {t("hero.title_prefix")}
          <span className="text-brand-amber">{t("hero.title_highlight")}</span>
        </h1>
        <p className="mx-auto mb-9 max-w-xl text-[17px] leading-relaxed text-slate-600 dark:text-slate-400">
          {t("hero.subtitle")}
        </p>

        {/* Search */}
        <div className="mx-auto mb-12 flex max-w-[560px] overflow-hidden rounded-xl border border-brand-border bg-brand-card2 focus-within:border-brand-amber transition-colors">
          <Input
            placeholder={t("hero.search_placeholder")}
            className="flex-1 border-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0"
          />
          <Button className="rounded-none bg-brand-amber px-6 font-semibold text-black hover:bg-brand-amber2">
            <Search className="mr-2 h-4 w-4" /> {tc("search")}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-sora text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────── */}
      <section className="border-y border-brand-border bg-brand-bg2 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-4">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-500">{t("trust_bar")}</span>
          {trustLogos.map((name) => (
            <span key={name} className="font-sora text-sm font-bold text-slate-600">{name}</span>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("categories.tag")}
          title={t("categories.title")}
          subtitle={t("categories.subtitle")}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-card p-4 text-center transition-all hover:-translate-y-1 hover:border-brand-amber/50 hover:bg-brand-card2"
            >
              <span className="mb-2 text-3xl">{cat.icon}</span>
              <span className="font-sora text-[13px] font-semibold text-slate-900 dark:text-white">{cat.name}</span>
              <span className="mt-1 text-[11px] text-slate-500">{t("categories.course_count", { count: cat.count })}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl border-t border-brand-border" />

      {/* ── FEATURED COURSES ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 flex items-end justify-between">
          <SectionHeader
            tag={t("featured.tag")}
            title={t("featured.title")}
            subtitle={t("featured.subtitle")}
          />
          <Button variant="ghost" className="mb-9 text-sm text-brand-amber hover:text-brand-amber2">
            {t("featured.view_all")} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl border-t border-brand-border" />

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("features.tag")}
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((f) => (
            <Card
              key={f.title}
              className="border border-brand-border bg-brand-card transition-colors hover:border-brand-amber/30"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-amber/10">
                  <f.icon className="h-5 w-5 text-brand-amber" />
                </div>
                <h3 className="font-sora mb-2 text-[15px] font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl border-t border-brand-border" />

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          tag={t("testimonials.tag")}
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonialsList.map((t) => (
            <Card
              key={t.name}
              className="border border-brand-border bg-brand-card transition-colors hover:border-brand-amber/30"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex text-brand-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sora text-sm font-bold ${t.avatarClass}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-sora text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-brand-border bg-brand-bg2 px-8 py-16 text-center">
          {/* Glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-amber/8 blur-[60px]" />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-brand-amber">{t("cta.tag")}</p>
          <h2 className="font-sora mx-auto mb-4 max-w-xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-brand-amber px-8 font-bold text-black hover:bg-brand-amber2">
              {t("cta.button")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-brand-border bg-transparent text-slate-900 dark:text-white hover:border-brand-amber hover:text-brand-amber"
            >
              {t("cta.secondary_button")}
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
