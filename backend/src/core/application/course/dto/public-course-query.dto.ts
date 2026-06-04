import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class PublicCourseQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly level?: string;

  @IsOptional()
  @IsString()
  @IsIn(['latest', 'oldest', 'price_asc', 'price_desc', 'rating_desc'])
  readonly sortBy?: string;
}
