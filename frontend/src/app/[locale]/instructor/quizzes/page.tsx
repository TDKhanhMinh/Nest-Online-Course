import { Metadata } from "next";
import InstructorQuizCreatorView from "@/features/instructor/presentation/components/instructor-quiz-creator-view";

export const metadata: Metadata = {
  title: "Quiz Creator | Instructor Portal",
  description: "Create and configure assessments",
};

export default function QuizCreatorPage() {
  return <InstructorQuizCreatorView />;
}
