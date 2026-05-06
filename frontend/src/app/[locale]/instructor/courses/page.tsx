import { Metadata } from "next";
import InstructorCoursesView from "@/features/instructor/presentation/components/instructor-courses-view";

export const metadata: Metadata = {
  title: "My Courses | Instructor Portal",
  description: "Manage your courses and students",
};

export default function InstructorCoursesPage() {
  return <InstructorCoursesView />;
}
