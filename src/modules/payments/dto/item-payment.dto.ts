import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ItemPaymentDto {
  @ApiProperty({
    description: 'Name of the item',
    required: true,
    example: 'Iphone 15 pro max',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Price of the item',
    required: true,
    example: 1500,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Quantity of the item',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
