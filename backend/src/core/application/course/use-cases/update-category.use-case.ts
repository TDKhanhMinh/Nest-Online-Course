import {
  ICATEGORY_REPOSITORY,
  ICategoryRepository
} from '@domain/course/ports/i-category.repository';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CategoryResponseDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findById(new UniqueId(id));
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findBySlug(dto.slug);
      if (existing) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    category.update({
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parentId === undefined ? undefined : (dto.parentId ? new UniqueId(dto.parentId) : null),
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
