import { categoryService } from "../infrastructure/category.service";
import { Category, CreateCategoryDto } from "../domain/category.types";

export class CreateCategoryUseCase {
  async execute(data: CreateCategoryDto): Promise<Category> {
    return await categoryService.create(data);
  }
}

export const createCategoryUseCase = new CreateCategoryUseCase();
