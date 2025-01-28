import { IsUUID, IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsDateString()
  date: string;

  @IsString()
  time?: string;

  @IsString()
  notes?: string;
}
