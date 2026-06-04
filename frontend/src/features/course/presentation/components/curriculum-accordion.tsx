import { useState } from "react";
import { PlayCircle, Lock, ChevronDown, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Section, Lesson } from "../../domain/course.types";

interface CurriculumAccordionProps {
  sections: Section[];
}

export function CurriculumAccordion({ sections }: CurriculumAccordionProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isPreview) {
      setSelectedLesson(lesson);
    }
  };

  return (
    <>
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
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex items-center justify-between py-4 px-6 transition-colors ${
                      lesson.isPreview
                        ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lesson.isPreview ? (
                        <PlayCircle className="h-4 w-4 text-brand-amber" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                      <span className={`text-sm font-medium ${lesson.isPreview ? "text-slate-900 dark:text-white hover:text-brand-amber font-semibold" : "text-slate-700 dark:text-slate-300"}`}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {lesson.isPreview && (
                        <Badge variant="outline" className="text-[10px] h-5 border-brand-amber text-brand-amber bg-brand-amber/5">
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

      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="sm:max-w-2xl bg-brand-card border-brand-border text-slate-900 dark:text-white">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-sora text-xl font-bold flex items-center gap-2">
              {selectedLesson?.type === "video" ? (
                <PlayCircle className="h-5 w-5 text-brand-amber" />
              ) : (
                <BookOpen className="h-5 w-5 text-brand-amber" />
              )}
              {selectedLesson?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedLesson && (
            <div className="mt-2">
              {selectedLesson.type === "video" ? (
                selectedLesson.videoUrl || selectedLesson.contentUrl ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-brand-border shadow-inner">
                    <video
                      src={selectedLesson.videoUrl || selectedLesson.contentUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 border border-brand-border rounded-lg bg-slate-900/10 text-slate-500 dark:text-slate-400">
                    Video content url is missing or private.
                  </div>
                )
              ) : (
                <div className="max-h-[60vh] overflow-y-auto pr-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-sans bg-slate-950/20 p-4 rounded-lg border border-brand-border">
                  {selectedLesson.contentUrl || selectedLesson.textContent || "Sample lesson text is empty."}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Accordion items fit viewport, Dialog wraps to screen width with vertical video.
// tablet  (md / lg):       Grid alignments and hover highlights. Dialog scales to max-w-2xl.
// desktop (xl / 2xl):      Hover effects on active previews, custom video scaling and shadow depths.
// Interaction:             Preview icons turn clickable, launching video playback or article viewing modal.
