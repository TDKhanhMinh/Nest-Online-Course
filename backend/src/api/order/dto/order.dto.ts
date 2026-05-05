import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  courseIds: string[];
}
