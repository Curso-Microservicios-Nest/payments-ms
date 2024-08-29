import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from './services/notifications.service';
import { OrdersService } from './services/orders.service';
import { PaymentsService } from './services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Permite crear una orden de pago.
   * @param createOrder Datos de la orden.
   * @returns URL de redirección para completar la orden.
   */
  @Post('create-order')
  async createOrder(@Body() createOrder: CreateOrderDto) {
    const orderLink = await this.ordersService.createOrder(createOrder);
    return { redirect: orderLink };
  }

  /**
   * Endpoint donde se redirige al usuario después de completar el pago.
   * @param token Token de la orden.
   * @returns Mensaje de éxito.
   */
  @Get('complete-order')
  async success(@Query('token') token: string) {
    const order = await this.ordersService.captureOrder(token);
    return {
      message: 'Payment successful',
      data: { status: order.status, payer: order.payer },
    };
  }

  /**
   * Endpoint donde se redirige al usuario después de cancelar el pago.
   * @returns Mensaje de cancelación.
   */
  @Get('cancel-order')
  cancel() {
    return { message: 'Payment cancelled' };
  }

  /**
   * Endpoint donde se notifica un pago realizado. Este endpoint es llamado
   * por el webhook de PayPal.
   * @param body Datos de la notificación
   * @returns Mensaje de éxito.
   */
  @Post('payment-notification')
  async notification(@Body() body: any): Promise<void> {
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      await this.paymentsService.processPayment(body);
    }
  }

  /**
   * Permite suscribirse a eventos de pago de PayPal.
   * @returns Datos del webhook creado.
   */
  @Post('webhooks')
  async stripeWebhook() {
    const webhook = await this.notificationsService.createWebhook();
    return { webhook };
  }

  /**
   * Permite obtener la lista de webhooks de PayPal.
   * @returns Lista de webhooks.
   */
  @Get('webhooks')
  getWebhooks() {
    return this.notificationsService.getWebhooks();
  }

  /**
   * Permite eliminar un webhook de PayPal.
   * @param id ID del webhook.
   * @returns Mensaje de éxito.
   */
  @Delete('webhooks/:id')
  async deleteWebhooks(@Param('id') id: string) {
    await this.notificationsService.deleteWebhook(id);
    return { message: 'Webhook deleted' };
  }
}
