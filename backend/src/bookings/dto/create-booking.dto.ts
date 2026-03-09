import { IsDateString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  productId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
