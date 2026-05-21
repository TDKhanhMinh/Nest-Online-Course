import { Metadata } from "next";

import InstructorQuizBankView from "@/features/instructor/presentation/components/instructor-quiz-bank-view";

export const metadata: Metadata = {
  title: "Quiz Bank | Instructor Portal",
  description: "Browse and manage instructor quizzes",
};

export default function QuizBankPage() {
  return <InstructorQuizBankView />;
}
