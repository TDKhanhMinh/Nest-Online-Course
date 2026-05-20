import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { GetAllCategoriesUseCase } from '@application/course/use-cases/get-all-categories.use-case';
import { GetCategoriesOffsetUseCase } from '@application/course/use-cases/get-categories-offset.use-case';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly getCategoriesOffsetUseCase: GetCategoriesOffsetUseCase,
  ) {}

  @Get('all')
  async getAll() {
    return this.getAllCategoriesUseCase.execute();
  }

  @Get()
  async getCategories(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    return this.getCategoriesOffsetUseCase.execute(pageOptionsDto);
  }
}
