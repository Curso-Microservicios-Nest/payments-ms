import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from './services/notifications.service';
import { OrdersService } from './services/orders.service';
import { PaymentsService } from './services/payments.service';

@Controller('payments')
@ApiTags('Payments')
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
  @MessagePattern('create.order')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  async createOrder(@Payload() createOrder: CreateOrderDto) {
    const url = await this.ordersService.createOrder(createOrder);
    return { url };
  }

  /**
   * Endpoint donde se redirige al usuario después de completar el pago.
   * @param token Token de la orden.
   * @returns Mensaje de éxito.
   */
  @Get('complete-order')
  @ApiOperation({ summary: 'Order completed' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment successful' })
  @ApiUnprocessableEntityResponse({ description: 'Order already captured' })
  async success(@Query('token') token: string) {
    const order = await this.ordersService.captureOrder(token);
    return {
      message: 'Payment successful',
      data: { orderId: order.id, status: order.status, payer: order.payer },
    };
  }

  /**
   * Endpoint donde se redirige al usuario después de cancelar el pago.
   * @returns Mensaje de cancelación.
   */
  @Get('cancel-order')
  @ApiOperation({ summary: 'Order cancelled' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order cancelled' })
  cancel(@Query('token') token: string) {
    return { message: `Order cancelled by ID: ${token}` };
  }

  /**
   * Endpoint donde se notifica un pago realizado. Este endpoint es llamado
   * por el webhook de PayPal. Debe estar expuesto por SSL para que PayPal
   * pueda enviar notificaciones.
   * @param body Datos de la notificación
   * @returns Mensaje de éxito.
   */
  @Post('payment-notification')
  @ApiOperation({ summary: 'Payment notification' })
  @ApiNoContentResponse({ description: 'Notification received' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async notification(@Body() body: any): Promise<void> {
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      await this.paymentsService.processPayment(body);
    }
  }

  /**
   * Permite suscribirse a eventos de pago de PayPal. Se debe tener configurada la
   * variable de entorno BASE_URL con SSL para que PayPal pueda enviar notificaciones.
   * @returns Datos del webhook creado.
   */
  @Post('webhooks')
  @ApiOperation({ summary: 'Subscribe to payment events' })
  async stripeWebhook() {
    const webhook = await this.notificationsService.createWebhook();
    return { webhook };
  }

  /**
   * Permite obtener la lista de webhooks de PayPal.
   * @returns Lista de webhooks.
   */
  @Get('webhooks')
  @ApiOperation({ summary: 'List all webhooks' })
  getWebhooks() {
    return this.notificationsService.getWebhooks();
  }

  /**
   * Permite eliminar un webhook de PayPal.
   * @param id ID del webhook.
   * @returns Mensaje de éxito.
   */
  @Delete('webhooks/:id')
  @ApiOperation({ summary: 'Delete a webhook' })
  async deleteWebhooks(@Param('id') id: string) {
    await this.notificationsService.deleteWebhook(id);
    return { message: 'Webhook deleted' };
  }
}
