import {
  courseApi,
  type UploadVideoResponse,
} from "../infrastructure/course.api";

export class UploadCourseVideoUseCase {
  async execute(file: File): Promise<UploadVideoResponse> {
    return courseApi.uploadVideo(file);
  }
}

export const uploadCourseVideoUseCase = new UploadCourseVideoUseCase();
