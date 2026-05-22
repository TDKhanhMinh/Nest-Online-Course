import { queryKeys } from "@/lib/query-keys";
import { useMutation } from "@tanstack/react-query";

import { uploadCourseThumbnailUseCase } from "../../application/upload-course-thumbnail.use-case";
import { uploadCourseVideoUseCase } from "../../application/upload-course-video.use-case";

export const useUploadCourseThumbnail = () =>
  useMutation({
    mutationKey: queryKeys.courses.uploadThumbnail(),
    mutationFn: (file: File) => uploadCourseThumbnailUseCase.execute(file),
  });

export const useUploadCourseVideo = () =>
  useMutation({
    mutationKey: queryKeys.courses.uploadVideo(),
    mutationFn: (file: File) => uploadCourseVideoUseCase.execute(file),
  });
