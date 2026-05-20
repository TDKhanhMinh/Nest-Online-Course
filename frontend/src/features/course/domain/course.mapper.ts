import { CourseDTO } from "../infrastructure/course.api";
import { Course } from "./course.types";

export const mapCourseDtoToEntity = (dto: CourseDTO): Course => {
  console.log("mapCourseDtoToEntity", dto)
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    // shortDescription: "", // Not supported by backend yet
    price: dto.price,
    level: dto.level,
    status: dto.status,
    thumbnailUrl: dto.thumbnailUrl,
    instructorId: dto.instructorId,
    categoryId: dto.categoryId,
    language: dto.language,
    avgRating: dto.avgRating,
    totalReviews: dto.totalReviews,
    totalStudents: dto.totalStudents,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    // UI helper fields
    rating: dto.avgRating,
    thumbnail: dto.thumbnailUrl || "",
  };
};
