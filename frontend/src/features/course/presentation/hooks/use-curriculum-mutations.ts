import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateLessonInput,
  createLessonUseCase,
  deleteLessonUseCase,
  UpdateLessonInput,
  updateLessonUseCase
} from "../../application/lesson-operations.use-case";
import {
  CreateSectionInput,
  createSectionUseCase,
  deleteSectionUseCase,
  UpdateSectionInput,
  updateSectionUseCase
} from "../../application/section-operations.use-case";

export const useSectionMutations = (courseId: string) => {
  const queryClient = useQueryClient();

  const createSection = useMutation({
    mutationFn: (data: CreateSectionInput) => 
      createSectionUseCase.execute(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      toast.success("Section created successfully");
    },
    onError: () => toast.error("Failed to create section"),
  });

  const updateSection = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSectionInput }) => 
      updateSectionUseCase.execute(courseId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
      toast.success("Section updated successfully");
    },
    onError: () => toast.error("Failed to update section"),
  });

  const deleteSection = useMutation({
    mutationFn: (id: string) => deleteSectionUseCase.execute(courseId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
      toast.success("Section deleted successfully");
    },
    onError: () => toast.error("Failed to delete section"),
  });

  return { createSection, updateSection, deleteSection };
};

export const useLessonMutations = (courseId: string) => {
  const queryClient = useQueryClient();

  const createLesson = useMutation({
    mutationFn: (data: CreateLessonInput) => {
      const { sectionId, ...input } = data;
      return createLessonUseCase.execute(courseId, sectionId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      toast.success("Lesson created successfully");
    },
    onError: () => toast.error("Failed to create lesson"),
  });

  const updateLesson = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonInput }) => 
      updateLessonUseCase.execute(courseId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
      toast.success("Lesson updated successfully");
    },
    onError: () => toast.error("Failed to update lesson"),
  });

  const deleteLesson = useMutation({
    mutationFn: (id: string) => deleteLessonUseCase.execute(courseId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.instructor() });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
      toast.success("Lesson deleted successfully");
    },
    onError: () => toast.error("Failed to delete lesson"),
  });

  return { createLesson, updateLesson, deleteLesson };
};
