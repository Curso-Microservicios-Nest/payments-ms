import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { ItemPaymentDto } from 'src/modules/payments/dto/item-payment.dto';

export class CreateOrderDto {
  @IsString()
  @Length(3, 3)
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPaymentDto)
  items: ItemPaymentDto[];
}
