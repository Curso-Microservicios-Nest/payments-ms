import { Controller, Get, Post, Query } from '@nestjs/common';

import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder() {
    const orderLink = await this.paymentsService.createOrder();
    return { redirect: orderLink };
  }

  @Get('complete-order')
  async success(@Query('token') token: string) {
    const order = await this.paymentsService.captureOrder(token);
    return {
      message: 'Payment successful',
      data: { status: order.status, payer: order.payer },
    };
  }

  @Get('cancel-order')
  cancel() {
    return { message: 'Payment cancelled' };
  }

  @Post('webhook')
  stripeWebhook() {
    return 'Stripe webhook received';
  }
}
