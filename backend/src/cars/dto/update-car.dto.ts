import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDay?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
