"use client";

import { PlayCircle, Lock, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Section } from "../../domain/course.types";

interface CurriculumAccordionProps {
  sections: Section[];
}

export function CurriculumAccordion({ sections }: CurriculumAccordionProps) {
  return (
    <Accordion className="w-full space-y-4">
      {sections.map((section, index) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="border border-brand-border bg-brand-card/30 rounded-xl overflow-hidden px-0"
        >
          <AccordionTrigger className="hover:no-underline py-4 px-5 data-[state=open]:bg-brand-amber/5 transition-colors">
            <div className="flex flex-col items-start gap-1 text-left">
              <span className="text-xs font-semibold text-brand-amber uppercase tracking-wider">
                Section {index + 1}
              </span>
              <span className="font-sora text-[15px] font-bold text-slate-900 dark:text-white">
                {section.title}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <div className="divide-y divide-brand-border">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between py-4 px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {lesson.isPreview ? (
                      <PlayCircle className="h-4 w-4 text-brand-amber" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {lesson.isPreview && (
                      <Badge variant="outline" className="text-[10px] h-5 border-brand-amber text-brand-amber">
                        Preview
                      </Badge>
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      {lesson.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Full width accordion items, vertical stacking of content.
// tablet  (md / lg):       Consistent padding, smooth transitions.
// desktop (xl / 2xl):      Hover effects on lessons, clear distinction between locked and preview.
// Interaction:             Multiple sections can be open at once. Large touch targets (44px+) for triggers.
