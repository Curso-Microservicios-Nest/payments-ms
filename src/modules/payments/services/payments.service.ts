import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  async processPayment(event: any) {
    const paymentId = event.resource.id;
    const payerEmail = event.resource.payee.email_address;
    const amount = event.resource.amount.value;
    const currency = event.resource.amount.currency_code;
    const orderId = event.resource.custom_id;
    this.logger.log(`✅ ${event.summary}`);
    this.logger.log(
      `💵 Pago recibido: ${amount} ${currency} de ${payerEmail} (ID: ${paymentId})`,
    );
    this.logger.log(`🛒 Orden asociada: ${orderId}`);
  }
}
