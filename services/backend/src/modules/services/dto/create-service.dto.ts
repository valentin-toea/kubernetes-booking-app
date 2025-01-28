import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsUUID()
  categoryId: string;

  @IsString()
  username: string;
}
