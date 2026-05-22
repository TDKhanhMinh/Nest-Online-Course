import { courseApi } from "../infrastructure/course.api";

export class UploadCourseThumbnailUseCase {
  async execute(file: File): Promise<string> {
    const response = await courseApi.uploadFile(file);
    return response.url;
  }
}

export const uploadCourseThumbnailUseCase = new UploadCourseThumbnailUseCase();
