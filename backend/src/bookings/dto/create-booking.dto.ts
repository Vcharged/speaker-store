import { IsDateString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  carId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
