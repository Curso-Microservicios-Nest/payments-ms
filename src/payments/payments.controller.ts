import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('generate-access-token')
  async createPaymentSession() {
    return await this.paymentsService.generateAccessToken();
  }

  @Post('create-order')
  async createOrder() {
    return await this.paymentsService.createOrder();
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancel')
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
