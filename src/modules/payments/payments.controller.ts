import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from './services/notifications.service';
import { OrdersService } from './services/orders.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('create-order')
  async createOrder(@Body() createOrder: CreateOrderDto) {
    const orderLink = await this.ordersService.createOrder(createOrder);
    return { redirect: orderLink };
  }

  @Get('complete-order')
  async success(@Query('token') token: string) {
    const order = await this.ordersService.captureOrder(token);
    return {
      message: 'Payment successful',
      data: { status: order.status, payer: order.payer },
    };
  }

  @Get('cancel-order')
  cancel() {
    return { message: 'Payment cancelled' };
  }

  @Post('webhooks')
  async stripeWebhook() {
    const webhook = await this.notificationsService.createWebhook();
    return { webhook };
  }

  @Get('webhooks')
  async getWebhooks() {
    const webhooks = await this.notificationsService.getWebhooks();
    return { webhooks };
  }
}
