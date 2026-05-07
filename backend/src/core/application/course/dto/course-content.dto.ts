export class CreateSectionDto {
  title: string;
  orderIndex: number;
}

export class UpdateSectionDto {
  title?: string;
  orderIndex?: number;
}

export class SectionResponseDto {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export class CreateLessonDto {
  title: string;
  contentUrl?: string;
  textContent?: string;
  type: string;
  orderIndex: number;
  duration?: number;
  isFreePreview?: boolean;
}

export class UpdateLessonDto {
  title?: string;
  contentUrl?: string;
  textContent?: string;
  type?: string;
  orderIndex?: number;
  duration?: number;
  isFreePreview?: boolean;
}

export class LessonResponseDto {
  id: string;
  sectionId: string;
  title: string;
  contentUrl?: string;
  textContent?: string;
  type: string;
  orderIndex: number;
  duration?: number;
  isFreePreview: boolean;
}
