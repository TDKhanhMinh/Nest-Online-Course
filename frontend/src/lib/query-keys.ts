export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: <T extends object>(filters: T) =>
      [...queryKeys.courses.lists(), { filters }] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    instructor: () => [...queryKeys.courses.all, "instructor"] as const,
    uploadThumbnail: () =>
      [...queryKeys.courses.all, "upload", "thumbnail"] as const,
    uploadVideo: () => [...queryKeys.courses.all, "upload", "video"] as const,
    curriculum: (id: string) => [...queryKeys.courses.detail(id), "curriculum","list"] as const,
    curriculumDetail: (id: string, sectionId: string) => [...queryKeys.courses.curriculum(id), sectionId] as const,
    curriculumSection: (id: string, sectionId: string) => [...queryKeys.courses.curriculumDetail(id, sectionId), "section", sectionId] as const,
    curriculumLesson: (id: string, lessonId: string) => [...queryKeys.courses.curriculumDetail(id, lessonId), "lesson", lessonId] as const,
  },
  categories: {
    all: ["categories"] as const,
    full: () => [...queryKeys.categories.all, "full"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: <T extends object>(filters: T) =>
      [...queryKeys.categories.lists(), { filters }] as const,
  },
  admin: {
    all: ["admin"] as const,
    courses: () => [...queryKeys.admin.all, "courses"] as const,
    courseList: (filters: unknown) =>
      [...queryKeys.admin.courses(), "list", filters] as const,
    courseDetail: (id: string) => [...queryKeys.admin.courses(), "detail", id] as const,
    categories: () => [...queryKeys.admin.all, "categories"] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  instructor: {
    all: ["instructor"] as const,
    profile: () => [...queryKeys.instructor.all, "profile"] as const,
    me: () => [...queryKeys.instructor.profile(), "me"] as const,
    quizzes: {
      all: [...["instructor"], "quizzes"] as const,
      lists: () => [...queryKeys.instructor.quizzes.all, "list"] as const,
      list: <T extends object>(filters: T) =>
        [...queryKeys.instructor.quizzes.lists(), { filters }] as const,
      lessons: () => [...queryKeys.instructor.quizzes.all, "lesson"] as const,
      lesson: (lessonId: string) =>
        [...queryKeys.instructor.quizzes.lessons(), lessonId] as const,
      details: () => [...queryKeys.instructor.quizzes.all, "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.instructor.quizzes.details(), id] as const,
    },
    questions: {
      all: [...["instructor"], "questions"] as const,
      lists: () => [...queryKeys.instructor.questions.all, "list"] as const,
      list: <T extends object>(filters: T) =>
        [...queryKeys.instructor.questions.lists(), { filters }] as const,
      details: () =>
        [...queryKeys.instructor.questions.all, "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.instructor.questions.details(), id] as const,
    },
  },
};
