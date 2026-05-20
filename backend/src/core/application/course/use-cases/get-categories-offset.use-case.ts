import {
  ICATEGORY_REPOSITORY,
  ICategoryRepository
} from '@domain/course/ports/i-category.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PageMetaDto } from '@shared/pagination/offset/page-meta.dto';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { CategoryResponseDto } from '../dto/category.dto';

@Injectable()
export class GetCategoriesOffsetUseCase {
  constructor(
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(pageOptionsDto: PageOptionsDto): Promise<PageDto<CategoryResponseDto>> {
    const { items, total } = await this.categoryRepo.findWithOffset({
      page: pageOptionsDto.page ?? 1,
      limit: pageOptionsDto.limit ?? 10,
    });

    const categoryDtos = items.map(cat => ({
      id: cat.id.value,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId?.value,
    }));

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(categoryDtos, pageMetaDto);
  }
}
