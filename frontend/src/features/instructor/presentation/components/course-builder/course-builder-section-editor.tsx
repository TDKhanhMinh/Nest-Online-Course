"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Section } from "@/features/course/domain/course.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  sectionSchema,
  type SectionFormValues,
} from "./course-builder-form.schemas";

interface CourseBuilderSectionEditorProps {
  section: Section;
  onUpdate: (data: SectionFormValues) => void;
  isUpdating: boolean;
  onAddLesson: () => void;
}

export const CourseBuilderSectionEditor = ({
  section,
  onUpdate,
  isUpdating,
  onAddLesson,
}: CourseBuilderSectionEditorProps) => {
  const t = useTranslations("CourseBuilder");

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: section.title,
    },
  });

  return (
    <motion.div
      key={`section-${section.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-semibold">
          <Badge variant="outline" className="rounded-sm px-1 font-bold">
            SECTION
          </Badge>
        </div>
        <h2 className="text-3xl font-bold">Edit Section</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sections.section_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isUpdating}
                    placeholder={t("sections.section_placeholder")}
                    className="text-lg font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onAddLesson}>
              <Plus className="h-4 w-4 mr-2" />
              {t("sections.add_lesson")}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};
