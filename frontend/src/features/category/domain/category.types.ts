export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  courseCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  parentId?: string | null;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
