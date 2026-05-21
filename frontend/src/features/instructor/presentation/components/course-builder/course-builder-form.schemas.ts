import type {
  InstructorQuiz,
} from "@/features/instructor/application/instructor-quiz.mapper";
import { z } from "zod";

export const sectionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  type: z.enum(["video", "text", "quiz", "assignment"]),
  content: z.string().optional(),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  is_preview: z.boolean(),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
export type LessonFormValues = z.infer<typeof lessonSchema>;

export const quizMatchesSearch = (quiz: InstructorQuiz, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [quiz.title, quiz.description, quiz.lessonId]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
};
