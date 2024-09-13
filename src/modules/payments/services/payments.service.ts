import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Services } from 'src/enums';
import { PaidOrder } from '../interfaces/paid-order.interface';
import { PaymentNotification } from '../interfaces/payment-notification.interface';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async processPayment(event: PaymentNotification) {
    const orderId = event.resource.custom_id;
    const paymentId = event.resource.id;
    const totalPaid = parseFloat(event.resource.amount.value);
    const currency = event.resource.amount.currency_code;
    this.logger.log(`✅ ${event.summary}`);
    this.logger.log(`🛒 Orden asociada: ${orderId}`);
    const payload: PaidOrder = { orderId, paymentId, totalPaid, currency };
    this.client.emit('payment.created', payload);
  }
}
