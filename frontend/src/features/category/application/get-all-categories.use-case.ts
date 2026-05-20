import { categoryService } from "../infrastructure/category.service";
import { Category } from "../domain/category.types";

export class GetAllCategoriesUseCase {
  async execute(): Promise<Category[]> {
    return await categoryService.getAll();
  }
}

export const getAllCategoriesUseCase = new GetAllCategoriesUseCase();
