import { categoryService } from "../infrastructure/category.service";
import { Category, UpdateCategoryDto } from "../domain/category.types";

export class UpdateCategoryUseCase {
  async execute(id: string, data: UpdateCategoryDto): Promise<Category> {
    return await categoryService.update(id, data);
  }
}

export const updateCategoryUseCase = new UpdateCategoryUseCase();
