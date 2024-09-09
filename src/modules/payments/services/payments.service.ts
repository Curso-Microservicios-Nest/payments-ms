import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Services } from 'src/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(Services.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

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
    const payload = { pendiente: false };
    // TODO: Tovía no existe el evento 'payment.created'
    // Emit: Permite emitir un evento a través del cliente de microservicios.
    // Los eventos emitidos se pueden escuchar en otros microservicios.
    this.client.emit('payment.created', payload);
  }
}
