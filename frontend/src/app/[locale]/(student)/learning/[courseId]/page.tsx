import { LearningView } from "@/features/course/presentation/components/learning-view";

interface LearningPageProps {
  params: Promise<{
    courseId: string;
    locale: string;
  }>;
}

export default async function LearningPage({ params }: LearningPageProps) {
  const { courseId } = await params;
  return <LearningView courseId={courseId} />;
}
