import { CourseDetailView } from "@/features/course/presentation/components/course-detail-view";
import { notFound } from "next/navigation";
import { Course } from "@/features/course/domain/course.types";

const MOCK_COURSES: Course[] = [
  {
    id: "react-1",
    title: "React & Next.js 14 — Complete from Zero to Hero",
    slug: "react-nextjs-complete",
    author: "Khoa Nguyen",
    category: "Frontend",
    thumbnail: "/images/courses/react.png",
    rating: 4.9,
    reviewCount: 3241,
    price: 599000,
    originalPrice: 1299000,
    duration: 42,
    lessons: 186,
    students: 12400,
    level: "intermediate",
    isBestseller: true,
  },
  {
    id: "ai-1",
    title: "LLM Engineering & Prompt Engineering in Practice",
    slug: "llm-prompt-engineering",
    author: "Tuan Tran",
    category: "AI & Data Science",
    thumbnail: "/images/courses/ai.png",
    rating: 4.8,
    reviewCount: 1876,
    price: 799000,
    originalPrice: 1499000,
    duration: 28,
    lessons: 124,
    students: 8700,
    level: "advanced",
    isNew: true,
  },
  {
    id: "security-1",
    title: "Ethical Hacking & Penetration Testing for Beginners",
    slug: "ethical-hacking-beginners",
    author: "Dung Le",
    category: "Cybersecurity",
    thumbnail: "/images/courses/security.png",
    rating: 4.7,
    reviewCount: 987,
    price: 699000,
    originalPrice: 1199000,
    duration: 36,
    lessons: 158,
    students: 5200,
    level: "beginner",
    isHot: true,
  },
];

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = MOCK_COURSES.find(c => c.id === params.id);
  if (!course) return { title: "Course Not Found" };
  
  return {
    title: `${course.title} | NexLearn`,
    description: course.shortDescription || `Learn ${course.title} with expert instructors.`,
  };
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = MOCK_COURSES.find(c => c.id === params.id);
  
  if (!course) {
    notFound();
  }

  return <CourseDetailView course={course} />;
}
