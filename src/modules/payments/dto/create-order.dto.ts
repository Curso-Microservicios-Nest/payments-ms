import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { ItemPaymentDto } from 'src/modules/payments/dto/item-payment.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPaymentDto)
  items: ItemPaymentDto[];
}
