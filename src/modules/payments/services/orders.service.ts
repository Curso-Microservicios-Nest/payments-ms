import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { envs } from 'src/config';
import { CreateOrderDto } from '../dto/create-order.dto';
import { createAxiosConfig } from '../helpers/http.helper';
import { createOrderPayload } from '../helpers/orders.helper';
import { PayPalOrder } from '../interfaces/paypal-order.interface';
import { AuthService } from './auth.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Permite crear una orden de PayPal.
   * @param data Datos de la orden.
   * @returns URL de redirección para completar la orden.
   */
  async createOrder(data: CreateOrderDto) {
    const accessToken = await this.authService.generateAccessToken();
    const url = `${envs.paypal.baseUrl}/v2/checkout/orders222`;
    const body = createOrderPayload(data);
    const config = createAxiosConfig(accessToken);
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, config),
      );
      this.logger.log('Orden de PayPal creada exitosamente.');
      return response.data.links.find(
        (link: { rel: string }) => link.rel === 'payer-action',
      ).href;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error processing payment. Please try again later',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Permite capturar una orden de PayPal. Solo se debe llamar después de que el
   * usuario haya completado el pago y solo se puede capturar una vez.
   * @param orderId ID de la orden en PayPal.
   * @returns Datos de la orden capturada.
   */
  async captureOrder(orderId: string): Promise<PayPalOrder> {
    const accessToken = await this.authService.generateAccessToken();
    const url = `${envs.paypal.baseUrl}/v2/checkout/orders/${orderId}/capture`;
    const config = createAxiosConfig(accessToken);
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, {}, config),
      );
      const order = response.data as PayPalOrder;
      this.logger.log('Orden de PayPal capturada exitosamente.');
      return order;
    } catch (error) {
      if (error.response.data.details[0].issue === 'ORDER_ALREADY_CAPTURED') {
        this.logger.warn('La orden ya fue capturada.');
        throw new UnprocessableEntityException('La orden ya fue capturada.');
      }
      this.logger.error('Error al capturar la orden:', error.response.data);
      throw new HttpException(
        'Error al capturar la orden',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
