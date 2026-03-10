import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateProductDto {
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsNumber()
  price: number;
}
