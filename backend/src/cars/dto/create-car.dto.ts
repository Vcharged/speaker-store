import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCarDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  color: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
