import { Metadata } from "next";

import InstructorQuizCreatorView from "@/features/instructor/presentation/components/instructor-quiz-creator-view";

export const metadata: Metadata = {
  title: "Create Quiz | Instructor Portal",
  description: "Create and configure instructor quizzes",
};

export default function QuizCreatorPage() {
  return <InstructorQuizCreatorView />;
}
