import { Inject, Injectable } from '@nestjs/common';
import { 
  ICategoryRepository, 
  ICATEGORY_REPOSITORY 
} from '@domain/course/ports/i-category.repository';
import { CategoryResponseDto } from '../dto/category.dto';

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo.findAll();
    
    return categories.map(cat => ({
      id: cat.id.value,
      name: cat.name,
      slug: cat.slug,
    }));
  }
}
