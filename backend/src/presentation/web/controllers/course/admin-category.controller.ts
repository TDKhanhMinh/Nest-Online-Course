import { 
  Controller, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards 
} from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { Role } from '@shared/types/role.enum';
import { CreateCategoryDto, UpdateCategoryDto } from '@application/course/dto/category.dto';
import { CreateCategoryUseCase } from '@application/course/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '@application/course/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/course/use-cases/delete-category.use-case';

@Controller({
  path: 'admin/categories',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.updateCategoryUseCase.execute(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteCategoryUseCase.execute(id);
  }
}
