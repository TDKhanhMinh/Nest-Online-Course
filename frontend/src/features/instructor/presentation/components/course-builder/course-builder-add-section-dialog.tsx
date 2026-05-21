"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import type { SectionFormValues } from "./course-builder-form.schemas";

interface CourseBuilderAddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<SectionFormValues>;
  onSubmit: (values: SectionFormValues) => void;
  isCreating: boolean;
}

export const CourseBuilderAddSectionDialog = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  isCreating,
}: CourseBuilderAddSectionDialogProps) => {
  const t = useTranslations("CourseBuilder");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("sections.add_section")}</DialogTitle>
          <DialogDescription>
            {t("sections.add_section_description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sections.section_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("sections.section_placeholder")}
                      disabled={isCreating}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? t("creating") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
