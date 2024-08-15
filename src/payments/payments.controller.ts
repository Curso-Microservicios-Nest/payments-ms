import { Controller, Get, Post } from '@nestjs/common';
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
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancel-order')
  cancel() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }

  @Post('webhook')
  stripeWebhook() {
    return 'Stripe webhook received';
  }
}
