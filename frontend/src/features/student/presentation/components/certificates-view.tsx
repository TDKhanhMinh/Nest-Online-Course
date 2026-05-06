"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Download, Share2, Award, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  thumbnail: string;
  verifyId: string;
  instructor: string;
}

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    courseTitle: "React & Next.js 14 — Complete from Zero to Hero",
    issueDate: "2024-05-10",
    thumbnail: "/images/courses/react.png",
    verifyId: "NXL-8829-4412",
    instructor: "Khoa Nguyen",
  },
];

export function CertificatesView() {
  const t = useTranslations("Certificates");

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-sora text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_CERTIFICATES.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group relative overflow-hidden border-brand-border bg-brand-card/50 backdrop-blur-sm transition-all hover:border-brand-amber/40 hover:shadow-2xl">
              {/* Decorative Background */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-amber/10 blur-3xl transition-colors group-hover:bg-brand-amber/20" />
              
              <CardContent className="p-0">
                {/* Certificate Preview Image */}
                <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <Award className="mb-4 h-16 w-16 text-brand-amber opacity-20" />
                    <div className="h-full w-full border-4 border-double border-brand-amber/20 p-4">
                      <div className="flex h-full w-full flex-col items-center justify-center border border-brand-amber/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                        <span className="mb-2 font-serif text-[8px] uppercase tracking-widest text-slate-500">Certificate of Completion</span>
                        <h4 className="px-4 text-center font-sora text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {cert.courseTitle}
                        </h4>
                        <div className="mt-4 h-px w-20 bg-brand-amber/30" />
                        <span className="mt-2 text-[10px] text-slate-400">Awarded to Student Name</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Download className="h-4 w-4" />
                      {t("download")}
                    </Button>
                    <Button size="icon" variant="secondary" className="h-9 w-9">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-sora text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-sm text-slate-500">{cert.instructor}</p>
                    </div>
                    <Badge variant="outline" className="border-brand-amber/30 text-brand-amber bg-brand-amber/5">
                      VERIFIED
                    </Badge>
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {t("issued_on", { date: cert.issueDate })}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      {t("verify", { id: cert.verifyId })}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                      {t("download")}
                    </Button>
                    <Button variant="outline" size="icon" className="border-brand-border">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {MOCK_CERTIFICATES.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg border border-brand-border text-slate-300">
              <Award className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("empty.title")}
            </h3>
            <p className="mt-2 max-w-sm text-slate-600 dark:text-slate-400">
              {t("empty.description")}
            </p>
            <Link href="/my-courses" className="mt-8">
              <Button className="bg-brand-amber text-black hover:bg-brand-amber/90">
                {t("empty.button")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Single column, stacked buttons in card.
// tablet  (md / lg):       2 columns grid, hover effects enabled for pointer devices.
// desktop (xl / 2xl):      3 columns grid, rich glassmorphism effects and animations.
// Interaction:             Download and share actions via buttons or hover overlay.
