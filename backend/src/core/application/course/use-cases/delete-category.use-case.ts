import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { 
  ICategoryRepository, 
  ICATEGORY_REPOSITORY 
} from '@domain/course/ports/i-category.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepo.findById(new UniqueId(id));
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Optional: Check if there are subcategories or courses linked to this category
    // For now, simple delete.
    
    await this.categoryRepo.delete(category.id);
  }
}
