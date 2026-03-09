import { IsString } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsString()
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
}
