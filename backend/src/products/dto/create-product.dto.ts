import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum ProductCategory {
  SPEAKER = 'speaker',
  INSTRUMENT = 'instrument',
}

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
