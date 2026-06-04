import { getPublicCourseDetailUseCase } from "@/features/course/application/get-public-course-detail.use-case";
import { CourseDetailView } from "@/features/course/presentation/components/course-detail-view";
import { notFound } from "next/navigation";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  try {
    const { id } = await params;
    const course = await getPublicCourseDetailUseCase.execute(id);
    return {
      title: `${course.title} | NexLearn`,
      description: course.description || `Learn ${course.title} with expert instructors.`,
    };
  } catch {
    return { title: "Course Not Found" };
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  let course;

  try {
    course = await getPublicCourseDetailUseCase.execute(id);
  } catch {
    notFound();
  }

  return <CourseDetailView course={course} />;
}
