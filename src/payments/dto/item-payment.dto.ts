import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ItemPaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: string;
}
