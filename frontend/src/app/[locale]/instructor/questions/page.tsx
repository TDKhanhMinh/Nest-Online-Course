import { Metadata } from "next";
import InstructorQuestionBankView from "@/features/instructor/presentation/components/instructor-question-bank-view";

export const metadata: Metadata = {
  title: "Question Bank | Instructor Portal",
  description: "Manage your reusable question repository",
};

export default function QuestionBankPage() {
  return <InstructorQuestionBankView />;
}
