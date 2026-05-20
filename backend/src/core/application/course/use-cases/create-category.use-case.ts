import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { 
  ICategoryRepository, 
  ICATEGORY_REPOSITORY 
} from '@domain/course/ports/i-category.repository';
import { CreateCategoryDto, CategoryResponseDto } from '../dto/category.dto';
import { Category } from '@domain/course/entities/category.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Check if slug already exists
    const existing = await this.categoryRepo.findBySlug(dto.slug);
    if (existing) {
      throw new BadRequestException('Category with this slug already exists');
    }

    const category = Category.create({
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parentId ? new UniqueId(dto.parentId) : undefined,
    });

    await this.categoryRepo.save(category);

    return {
      id: category.id.value,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId?.value,
    };
  }
}
