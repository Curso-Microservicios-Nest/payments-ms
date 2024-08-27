import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { PaymentsController } from './payments.controller';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [AuthService, OrdersService, NotificationsService],
})
export class PaymentsModule {}
