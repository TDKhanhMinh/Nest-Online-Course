export interface Course {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  duration: number;
  lessons: number;
  students: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  isBestseller?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  description?: string;
  shortDescription?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}
