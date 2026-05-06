import { LearningView } from "@/features/course/presentation/components/learning-view";

export default function LearningPage({ params }: { params: { courseId: string } }) {
  // In a real app, we would fetch course data based on params.courseId here
  return <LearningView />;
}
