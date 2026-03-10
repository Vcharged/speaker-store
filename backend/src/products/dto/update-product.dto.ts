import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
