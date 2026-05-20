import { categoryService } from "../infrastructure/category.service";
import { Category } from "../domain/category.types";
import { PageDto, PageOptions } from "@/types/api";

export class GetCategoriesPaginatedUseCase {
  async execute(params: PageOptions): Promise<PageDto<Category>> {
    return await categoryService.getPaginated(params);
  }
}

export const getCategoriesPaginatedUseCase = new GetCategoriesPaginatedUseCase();
