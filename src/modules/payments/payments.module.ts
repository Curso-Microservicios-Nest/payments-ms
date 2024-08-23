import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { PaymentsController } from './payments.controller';
import { AuthService } from './services/auth.service';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [AuthService, OrdersService],
})
export class PaymentsModule {}
