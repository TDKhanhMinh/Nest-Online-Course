"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, Clock, Globe, Calendar, CheckCircle2, 
  PlayCircle, FileText, Smartphone, Award,
  ChevronRight, Share2, Heart, Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurriculumAccordion } from "./curriculum-accordion";
import { Course, Section } from "../../domain/course.types";

interface CourseDetailViewProps {
  course: Course;
}

const MOCK_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Introduction to the Course",
    lessons: [
      { id: "l1", title: "Course Overview", duration: "05:20", isPreview: true },
      { id: "l2", title: "Setting up the Environment", duration: "12:45", isPreview: true },
    ]
  },
  {
    id: "s2",
    title: "Core Concepts & Architecture",
    lessons: [
      { id: "l3", title: "Understanding the Virtual DOM", duration: "15:30", isPreview: false },
      { id: "l4", title: "Component Lifecycle Hooks", duration: "22:10", isPreview: false },
      { id: "l5", title: "State Management Patterns", duration: "18:25", isPreview: false },
    ]
  }
];

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const t = useTranslations("CourseDetail");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-brand-bg min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-12 lg:py-20 px-4">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumbs (Simplified) */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{t("tabs.overview")}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-brand-amber">{course.category}</span>
            </div>

            <h1 className="font-sora text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl">
              {course.shortDescription || "Master the most in-demand skills with this comprehensive, business-ready course designed for all levels."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="font-bold text-amber-400">{course.rating}</span>
                <span className="text-slate-400">({course.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="text-slate-300">
                Created by <span className="text-brand-amber font-semibold underline underline-offset-4 cursor-pointer">{course.author}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {t("hero.last_updated")} 12/2023
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> {t("hero.language")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Container */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Mobile Video Preview (Only on mobile/tablet) */}
            <div className="lg:hidden relative aspect-video rounded-xl overflow-hidden border border-brand-border bg-black mb-8">
               <Image src={course.thumbnail} alt="Preview" fill className="object-cover opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-slate-900 pl-1 shadow-2xl">
                    <Play className="h-8 w-8 fill-current" />
                  </div>
               </div>
            </div>

            {/* Overview Section */}
            <section className="border border-brand-border rounded-2xl p-6 lg:p-8 bg-brand-card/30">
              <h2 className="font-sora text-2xl font-bold mb-6">{t("overview.title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">Core learning outcome #{i} with detailed explanation of practical skills.</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="w-full justify-start border-b border-brand-border bg-transparent p-0 h-auto rounded-none gap-8 overflow-x-auto no-scrollbar">
                {["curriculum", "overview", "instructor", "reviews"].map(tab => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="rounded-none border-b-2 border-transparent px-0 py-4 font-bold text-slate-500 data-[state=active]:border-brand-amber data-[state=active]:text-brand-amber data-[state=active]:bg-transparent"
                  >
                    {t(`tabs.${tab}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="py-8">
                <TabsContent value="curriculum" className="mt-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="font-sora text-2xl font-bold">{t("curriculum.title")}</h2>
                    <span className="text-sm text-slate-500 font-medium">
                      {t("curriculum.stats", { sections: 12, lessons: 145, duration: "32h 45m" })}
                    </span>
                  </div>
                  <CurriculumAccordion sections={MOCK_SECTIONS} />
                </TabsContent>

                <TabsContent value="overview" className="mt-0 prose dark:prose-invert max-w-none">
                  <h3 className="font-sora text-xl font-bold mb-4">{t("overview.requirements")}</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Basic knowledge of the core concepts is recommended but not required.</li>
                    <li>A computer with internet access and a modern web browser.</li>
                    <li>Passion for learning and building real-world projects.</li>
                  </ul>
                  <h3 className="font-sora text-xl font-bold mt-8 mb-4">{t("overview.description")}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This course is built based on years of industry experience. You will not only learn the syntax but also the mindset of a professional developer. We cover everything from the basic setup to advanced optimization techniques.
                  </p>
                </TabsContent>

                <TabsContent value="instructor" className="mt-0">
                   <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <Avatar className="h-24 w-24 border-2 border-brand-amber">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-brand-amber/10 text-brand-amber text-2xl font-bold">KN</AvatarFallback>
                      </Avatar>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-sora text-xl font-bold text-slate-900 dark:text-white">{course.author}</h3>
                          <p className="text-slate-500">Senior Software Engineer & Tech Educator</p>
                        </div>
                        <div className="flex gap-6 text-sm">
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">4.9★</span>
                              <span className="text-slate-500">{t("instructor.reviews")}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">15,200</span>
                              <span className="text-slate-500">{t("instructor.students")}</span>
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">12</span>
                              <span className="text-slate-500">{t("instructor.courses")}</span>
                           </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                          Passionate about building scalable applications and sharing knowledge. Over 10 years of experience in the tech industry, helping thousands of students land their dream jobs.
                        </p>
                      </div>
                   </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                     <div className="text-center md:text-left">
                        <div className="text-5xl font-extrabold text-brand-amber mb-2">{course.rating}</div>
                        <div className="flex justify-center md:justify-start text-brand-amber mb-2">
                           {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
                        </div>
                        <div className="text-sm font-bold text-brand-amber">{t("reviews.rating_out_of")}</div>
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        {[5, 4, 3, 2, 1].map(r => (
                          <div key={r} className="flex items-center gap-4">
                             <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${r * 15 + 10}%` }} 
                                  className="h-full bg-brand-amber" 
                                />
                             </div>
                             <span className="text-xs font-bold text-slate-500 w-12">{r * 15 + 10}%</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sticky Sidebar (Enrollment Card) */}
          <aside className="relative">
            <div className={`lg:sticky lg:top-24 space-y-6 transition-all duration-300 ${isSticky ? 'lg:translate-y-0' : ''}`}>
               <Card className="overflow-hidden border-brand-border bg-brand-card shadow-2xl">
                  {/* Desktop Video Preview */}
                  <div className="hidden lg:block relative aspect-video border-b border-brand-border group cursor-pointer">
                    <Image src={course.thumbnail} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-slate-900 pl-1">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white">
                        {course.price.toLocaleString()}đ
                      </span>
                      <span className="text-slate-500 line-through">
                        {course.originalPrice.toLocaleString()}đ
                      </span>
                      <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-none">
                        -{(100 - Math.round(course.price/course.originalPrice*100))}%
                      </Badge>
                    </div>

                    <div className="grid gap-3">
                      <Button className="w-full bg-brand-amber text-black hover:bg-brand-amber2 font-bold h-12">
                        {t("enrollment.buy_now")}
                      </Button>
                      <Button variant="outline" className="w-full border-brand-border h-12 font-bold">
                        {t("enrollment.enroll_now")}
                      </Button>
                    </div>

                    <p className="text-[11px] text-center text-slate-500">
                      {t("enrollment.money_back")}
                    </p>

                    <div className="space-y-3">
                      <p className="text-sm font-bold">{t("enrollment.includes")}</p>
                      <ul className="space-y-2.5">
                        <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <PlayCircle className="h-4 w-4 text-brand-amber" /> {t("enrollment.lifetime")}
                        </li>
                        <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <Smartphone className="h-4 w-4 text-brand-amber" /> {t("enrollment.mobile")}
                        </li>
                        <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <Award className="h-4 w-4 text-brand-amber" /> {t("enrollment.certificate")}
                        </li>
                        <li className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <FileText className="h-4 w-4 text-brand-amber" /> {t("enrollment.assignments")}
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-border pt-4">
                      <Button variant="ghost" className="gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                      <Button variant="ghost" className="gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Heart className="h-4 w-4" /> Wishlist
                      </Button>
                    </div>
                  </CardContent>
               </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Bottom Mobile CTA */}
      <AnimatePresence>
        {isSticky && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-card border-t border-brand-border p-4 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
              <div className="flex flex-col">
                <span className="font-sora font-extrabold text-lg">{course.price.toLocaleString()}đ</span>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Sale Ends Soon</span>
              </div>
              <Button className="flex-1 bg-brand-amber text-black hover:bg-brand-amber2 font-bold h-12">
                {t("enrollment.buy_now")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Stacked layout. Hero text full width. Floating bottom CTA bar when scrolling.
// tablet  (md / lg):       Grid overview (2 columns). Tabs horizontal scrollable.
// desktop (xl / 2xl):      Sticky sidebar enrollment card. High information density. Staggered animations.
// Interaction:             Scroll-based sticky triggers. Tabbed navigation for depth. Touch targets optimized.
