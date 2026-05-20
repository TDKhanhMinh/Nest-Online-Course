import { categoryService } from "../infrastructure/category.service";

export class DeleteCategoryUseCase {
  async execute(id: string): Promise<void> {
    return await categoryService.delete(id);
  }
}

export const deleteCategoryUseCase = new DeleteCategoryUseCase();
