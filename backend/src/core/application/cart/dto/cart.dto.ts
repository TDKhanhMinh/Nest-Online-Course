import { IsString, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}



