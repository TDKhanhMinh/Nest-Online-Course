"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lesson, Section } from "@/features/course/domain/course.types";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import {
  FileText,
  GripVertical,
  HelpCircle,
  MoreVertical,
  Plus,
  Save,
  Settings,
  Trash2,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseBuilderSidebarProps {
  sections: Section[];
  activeLessonId: string | null;
  activeSectionId: string | null;
  showSettings: boolean;
  hasOrderChanged: boolean;
  onSaveOrder: () => void;
  onAddSection: () => void;
  onSelectSection: (sectionId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onAddLesson: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onReorderSections: (sections: Section[]) => void;
  onReorderLessons: (sectionId: string, lessons: Lesson[]) => void;
}

export const CourseBuilderSidebar = ({
  sections,
  activeLessonId,
  activeSectionId,
  showSettings,
  hasOrderChanged,
  onSaveOrder,
  onAddSection,
  onSelectSection,
  onSelectLesson,
  onAddLesson,
  onDeleteSection,
  onDeleteLesson,
  onReorderSections,
  onReorderLessons,
}: CourseBuilderSidebarProps) => {
  const t = useTranslations("CourseBuilder");

  return (
    <aside className="w-full lg:w-80 border-r bg-muted/30 flex flex-col h-[40vh] lg:h-full">
      <div className="p-4 border-b bg-background flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          {t("sections.title")}
        </h2>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary"
              onClick={onSaveOrder}
              title="Save Order"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={onAddSection}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={onReorderSections}
          className="space-y-4"
        >
          {sections.map((section) => (
            <Reorder.Item key={section.id} value={section} className="space-y-2">
              <div
                className={cn(
                  "group flex items-center justify-between p-2 rounded-md border bg-background transition-all hover:border-primary/50 cursor-pointer",
                  activeSectionId === section.id &&
                    "ring-2 ring-primary border-transparent",
                  showSettings && "opacity-50",
                )}
                onClick={() => onSelectSection(section.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <span className="font-medium truncate text-sm">
                    {section.title}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddLesson(section.id);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("sections.add_lesson")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteSection(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pl-6 space-y-2 border-l-2 border-muted ml-4">
                <Reorder.Group
                  axis="y"
                  values={section.lessons || []}
                  onReorder={(lessons) => onReorderLessons(section.id, lessons)}
                  className="space-y-2"
                >
                  {(section.lessons || []).map((lesson) => (
                    <Reorder.Item key={lesson.id} value={lesson}>
                      <div
                        className={cn(
                          "group flex items-center justify-between p-2 rounded-md border text-sm cursor-pointer transition-all hover:bg-muted/50",
                          activeLessonId === lesson.id
                            ? "bg-primary/5 border-primary"
                            : "bg-background",
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectLesson(lesson.id);
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {lesson.type === "video" && (
                            <Video className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {lesson.type === "text" && (
                            <FileText className="h-3.5 w-3.5 text-orange-500" />
                          )}
                          {lesson.type === "quiz" && (
                            <HelpCircle className="h-3.5 w-3.5 text-green-500" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDeleteLesson(lesson.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-muted-foreground hover:text-primary"
                  onClick={() => onAddLesson(section.id)}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {t("sections.add_lesson")}
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {sections.length === 0 && (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              {t("sections.empty")}
            </p>
            <Button variant="outline" size="sm" onClick={onAddSection}>
              <Plus className="h-4 w-4 mr-2" />
              {t("sections.add_section")}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
