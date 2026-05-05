import api from "@/lib/axios";

export interface CourseDTO {
  id: number;
  title: string;
  instructor: string;
  price: string;
}

export const courseApi = {
  getCourses: async (): Promise<CourseDTO[]> => {
    // In a real app: const response = await api.get<CourseDTO[]>("/courses");
    // return response.data;
    
    // Simulating API call for demo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { id: 1, title: "Next.js Mastery", instructor: "Antigravity", price: "$99" },
      { id: 2, title: "Clean Architecture", instructor: "DeepMind", price: "$149" },
      { id: 3, title: "Tailwind CSS v4", instructor: "UI Expert", price: "$79" },
    ];
  },
};
