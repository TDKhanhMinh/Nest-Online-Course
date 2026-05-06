import { Metadata } from "next";
import InstructorCourseBuilderView from "@/features/instructor/presentation/components/instructor-course-builder-view";

export const metadata: Metadata = {
  title: "Course Builder | Instructor Portal",
  description: "Build and organize your course curriculum",
};

export default function CourseBuilderPage() {
  return <InstructorCourseBuilderView />;
}
