import { courseApi, CourseDTO } from "../infrastructure/course.api";

export class GetCoursesUseCase {
  async execute(): Promise<CourseDTO[]> {
    // This is where you would put business logic, 
    // such as mapping data, validation, or combining multiple API calls.
    const courses = await courseApi.getCourses();
    
    // Example business logic: sort by title
    return courses.sort((a, b) => a.title.localeCompare(b.title));
  }
}

// Export a singleton or factory function
export const getCoursesUseCase = new GetCoursesUseCase();
