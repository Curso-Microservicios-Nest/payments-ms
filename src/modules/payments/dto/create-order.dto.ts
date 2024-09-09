import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

import { ItemPaymentDto } from 'src/modules/payments/dto/item-payment.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order ID',
    required: true,
    example: 'order-123',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Currency of the order',
    required: true,
    example: 'USD',
  })
  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'List of items to order',
    type: [ItemPaymentDto],
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPaymentDto)
  items: ItemPaymentDto[];
}
